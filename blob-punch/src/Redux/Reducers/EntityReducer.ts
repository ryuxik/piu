import { EntityState } from "../States";
import {
    START_BLOCK,
    RELEASE_BLOCK,
    JUMP,
    TAKE_DAMAGE,
    ATTACK,
    ALT_ATTACK,
    CHARGE_MANA,
    ADD_MANA,
    START_LEFT,
    STOP_LEFT,
    START_RIGHT,
    STOP_RIGHT,
    RESPAWN,
    TICK
} from "../Actions/EntityActionTypes";
import { GameLogic, PlayerLogic } from "../../Constants";
import { Vector2DInterface } from "../../CommonInterfaces/Physics";
import { Direction } from "../../CommonEnums";
import { MoveRectangle } from "../../Utils/PhysicsUtils";
import { PlayerActionTypes, ADD_ENTITY } from '../Actions/EntityActionTypes';

const initialState: Map<number, EntityState> = new Map();

export function entityReducer(state=initialState, action: PlayerActionTypes): Map<number, EntityState>  {
    switch (action.type) {
        case START_BLOCK: {
            const { id } = action.payload; 
            const entityState = state.get(id)!;
            if (!entityState.isCharging) {
                return {
                    ...state,
                    [id] : {
                        ...entityState,
                        chargeCounter: 0,
                        isBlocking: true,
                    }
                };
            }
            return state;
        }
        case RELEASE_BLOCK: {
            const { id } = action.payload;
            return  {
                ...state,
                [id] :
                {
                    ...state.get(id),
                    isBlocking: false,
                }
            };
        }
        case JUMP: {
            const { id } = action.payload;
            const entityState = state.get(id)!;
            if (!entityState.isBlocking && !entityState.isCharging) {
                let velocity = entityState.velocity;
                if (entityState.rectangle.bottomLeft.y === GameLogic.PLATFORM_STARTING_Y) {
                    let newVelocity = {
                        vx : entityState.velocity.vx,
                        vy: PlayerLogic.JUMP_VEL_Y,
                    };
                    velocity = newVelocity;
                } 
                return {
                    ...state,
                    [id] : {
                        ...entityState,
                        chargeCounter: 0,
                        numTicksInactive: 0,
                        velocity,
                    }
                };
            }
            return state
        }
        case TAKE_DAMAGE: {
            const { id, direction, damage } = action.payload;
            const myState = state.get(id)!;

            let newVelocity : Vector2DInterface = { vx: 0, vy: 0 };
            let newHealth : number = myState.health;
            let newLives: number = myState.numLives;

            let knockbackVxMagnitude: number;
            if (myState.isBlocking) { // Entity does not take damage
                knockbackVxMagnitude = PlayerLogic.KNOCKBACK_VEL_X;
            } else {
                newHealth -= damage;
                newVelocity.vy = PlayerLogic.KNOCKBACK_VEL_Y
                knockbackVxMagnitude = PlayerLogic.KNOCKBACK_VEL_X_BLOCK;
                if (newHealth < 0) { // Entity lost a life.
                    newLives -= 1;
                    if (newLives <= 0) { // Entity is dead.
                        return {
                            ...state,
                            [id] : {
                                ...myState,
                                health: newHealth,
                                lives: newLives,
                                isAlive: false,
                            }
                        };
                    } else { // Respawn
                        let bottomLeft = {
                            x: PlayerLogic.STARTING_POS_X,
                            y: PlayerLogic.STARTING_POS_Y
                        };
                        return {
                            ...state,
                            [id] : {
                                ...myState,
                                numLives: newLives,
                                health: PlayerLogic.STARTING_HEALTH,
                                velocity: {
                                    vx: PlayerLogic.STARTING_VEL_X,
                                    vy: PlayerLogic.STARTING_VEL_Y
                                },
                                rectangle: {
                                    bottomLeft: {
                                        x: bottomLeft.x,
                                        y: bottomLeft.y
                                    },
                                    bottomRight: {
                                        x: bottomLeft.x + PlayerLogic.PLAYER_WIDTH,
                                        y: bottomLeft.y,
                                    },
                                    topLeft: {
                                        x: bottomLeft.x,
                                        y: bottomLeft.y - PlayerLogic.PLAYER_HEIGHT,
                                    },
                                    topRight: {
                                        x: bottomLeft.x + PlayerLogic.PLAYER_WIDTH,
                                        y: bottomLeft.y - PlayerLogic.PLAYER_HEIGHT,
                                    },
                                }
                            }
                        };
                    }
                }
            }

            newVelocity.vx = direction === Direction.LEFT ? -knockbackVxMagnitude : knockbackVxMagnitude;
            return {
                ...state,
                [id] : {
                    ...myState,
                    health: newHealth,
                    knockbackTicks: PlayerLogic.KNOCKBACK_TICKS,
                    velocity: newVelocity
                }
            };
        }
        case ATTACK: {
            const { id } = action.payload;
            const entityState = state.get(id)!;
            if (!entityState.isBlocking && !entityState.isCharging) {
                return {
                    ...state,
                    [id] : {
                        ...entityState,
                        chargeCounter: 0,
                        numTicksInactive: 0
                    }
                }
            }
            return state;
        }
        case ALT_ATTACK: {
            const { id } = action.payload;
            const entityState = state.get(id)!;
            if (entityState.mana > PlayerLogic.ALT_ATTACK_COST) {
                return {
                    ...state,
                    [id] : {
                        ...entityState,
                        mana:  Math.max(0, entityState.mana - PlayerLogic.ALT_ATTACK_COST)
                    }
                };
                // have weapon reducer handle this
                // let bottomLeft: Coordinate2DInterface = {
                //     x: this.directionFacing === Direction.RIGHT ? this.rectangle.bottomRight.x : this.rectangle.bottomLeft.x,
                //     y: this.rectangle.topRight.y + PlayerLogic.ALT_ATTACK_ORIGIN_Y_OFFSET };
                // if (this.entityManager && this.opponent) {
                //     this.entityManager.addEntity(
                //         new BaseProjectile(
                //             bottomLeft,
                //             this.directionFacing,
                //             this.opponent));
                // }
            }
            return state;
        }
        case CHARGE_MANA: {
            const { id } = action.payload;
            const entityState = state.get(id)!;
            return {
                ...state,
                [id] : {
                    ...entityState,
                    isCharging: !entityState.isBlocking,
                }
            };
        }
        case ADD_MANA: {
            const { id } = action.payload;
            const entityState = state.get(id)!;
            return {
                ...state,
                [id] : {
                    ...entityState,
                    mana:  Math.min(entityState.mana + entityState.chargeCounter / PlayerLogic.TICKS_PER_MANA_CHARGE,
                        PlayerLogic.MAX_MANA),
                    isCharging: false,
                    chargeCounter: 0
                }
            };        
        }
        case START_LEFT: {
            const { id } = action.payload;
            const entityState = state.get(id)!;
            if (!entityState.isBlocking && !entityState.isCharging) {
                return {
                    ...state,
                    [id] : {
                        ...entityState,
                        directionMoving: Direction.RIGHT,
                        directionFacing: Direction.LEFT,
                        numTicksInactive: 0
                    }
                };
            }
        }
        case STOP_LEFT: {
            // noop
            return state;
        }
        case START_RIGHT: {
            const { id } = action.payload;
            const entityState = state.get(id)!;
            if (!entityState.isBlocking && !entityState.isCharging) {
                return {
                    ...state,
                    [id] : {
                        ...entityState,
                        directionMoving: Direction.RIGHT,
                        directionFacing: Direction.RIGHT,
                        numTicksInactive: 0
                    }
                };
            }
        }
        case STOP_RIGHT: {
            // noop
            return state;
        }
        case RESPAWN: {
            const { id } = action.payload;
            const entityState = state.get(id)!;
            let bottomLeft = {
                x: PlayerLogic.STARTING_POS_X,
                y: PlayerLogic.STARTING_POS_Y
            };
            let newLives = entityState.numLives - 1;
            return {
                ...state,
                [id] : {
                    ...entityState,
                    numLives: newLives,
                    isAlive: newLives > 0,
                    health: PlayerLogic.STARTING_HEALTH,
                    velocity: {
                        vx: PlayerLogic.STARTING_VEL_X,
                        vy: PlayerLogic.STARTING_VEL_Y
                    },
                    rectangle: {
                        bottomLeft: {
                            x: bottomLeft.x,
                            y: bottomLeft.y
                        },
                        bottomRight: {
                            x: bottomLeft.x + PlayerLogic.PLAYER_WIDTH,
                            y: bottomLeft.y,
                        },
                        topLeft: {
                            x: bottomLeft.x,
                            y: bottomLeft.y - PlayerLogic.PLAYER_HEIGHT,
                        },
                        topRight: {
                            x: bottomLeft.x + PlayerLogic.PLAYER_WIDTH,
                            y: bottomLeft.y - PlayerLogic.PLAYER_HEIGHT,
                        },
                    }
                }
            }; 
        }
        case TICK: {
            const { id } = action.payload;
            const entityState = state.get(id)!;
            let numTicksAlive = entityState.numTicksAlive;
            let numTicksInactive = entityState.numTicksInactive;
            let chargeCounter = entityState.chargeCounter;
            let knockbackTicks = entityState.knockbackTicks;
            let velocity = entityState.velocity;

            numTicksAlive++;
            numTicksInactive++;

            if (numTicksInactive > PlayerLogic.INACTIVE_KILL_THRESHOLD) {
                let bottomLeft = {
                    x: PlayerLogic.STARTING_POS_X,
                    y: PlayerLogic.STARTING_POS_Y
                };
                let newLives = entityState.numLives - 1;
                return {
                    ...state,
                    [id] : {
                        ...entityState,
                        numLives: newLives,
                        isAlive: newLives > 0,
                        numTicksInactive: 0,
                        health: PlayerLogic.STARTING_HEALTH,
                        velocity: {
                            vx: PlayerLogic.STARTING_VEL_X,
                            vy: PlayerLogic.STARTING_VEL_Y
                        },
                        rectangle: {
                            bottomLeft: {
                                x: bottomLeft.x,
                                y: bottomLeft.y
                            },
                            bottomRight: {
                                x: bottomLeft.x + PlayerLogic.PLAYER_WIDTH,
                                y: bottomLeft.y,
                            },
                            topLeft: {
                                x: bottomLeft.x,
                                y: bottomLeft.y - PlayerLogic.PLAYER_HEIGHT,
                            },
                            topRight: {
                                x: bottomLeft.x + PlayerLogic.PLAYER_WIDTH,
                                y: bottomLeft.y - PlayerLogic.PLAYER_HEIGHT,
                            },
                        }
                    }
                };
            }
    
            if (entityState.isCharging) {
                chargeCounter++;
            }
            if (entityState.knockbackTicks > 0) {
                knockbackTicks--;
            }
            if (knockbackTicks === 0) {
                switch(entityState.directionMoving){
                    case Direction.LEFT:
                        velocity.vx = -PlayerLogic.MAX_X_VEL_COMMANDED;
                    case Direction.RIGHT:
                        velocity.vx = PlayerLogic.MAX_X_VEL_COMMANDED;
                    case Direction.STOP:
                        velocity.vx = 0;
                }
            }
            
            velocity.vy += GameLogic.GRAVITY;
            let newRectangle = MoveRectangle(entityState.rectangle, entityState.velocity);
            let isOnstage = entityState.isOnstage;
    
            if (newRectangle.bottomLeft.x < GameLogic.PLATFORM_STARTING_X + GameLogic.PLATFORM_WIDTH &&
                newRectangle.bottomRight.x > GameLogic.PLATFORM_STARTING_X &&
                entityState.rectangle.topLeft.y < GameLogic.PLATFORM_STARTING_Y) {
                isOnstage = true;
                let delta_y = newRectangle.bottomLeft.y - GameLogic.PLATFORM_STARTING_Y;
                if (delta_y > 0) {
                    // move to the floor of the platform, should not intersect platform
                    let adjustmentVector : Vector2DInterface = { vx: 0, vy: -delta_y };
                    newRectangle = MoveRectangle(newRectangle, adjustmentVector);
                }
                
                if (newRectangle.bottomRight.y === GameLogic.PLATFORM_STARTING_Y) {
                    velocity.vy = 0;
                    // friction from standing on the platform
                    if (entityState.directionMoving === Direction.STOP) {
                        velocity.vx += velocity.vx > 0 ? -GameLogic.FRICTION : GameLogic.FRICTION;
                        // Remove entity creeping
                        if (Math.abs(velocity.vx) <= PlayerLogic.MIN_VEL_X) {
                            velocity.vx = 0;
                        }
                    }
                }
            } else {
                isOnstage = false;
            }
    
            // not possible to get back on stage anymore, respawn.
            if (!isOnstage && newRectangle.bottomLeft.y  > GameLogic.PLATFORM_STARTING_Y) {
                let bottomLeft = {
                    x: PlayerLogic.STARTING_POS_X,
                    y: PlayerLogic.STARTING_POS_Y
                };
                let newLives = entityState.numLives - 1;
                return {
                    ...state,
                    [id] : {
                        ...entityState,
                        numLives: newLives,
                        isAlive: newLives > 0,
                        health: PlayerLogic.STARTING_HEALTH,
                        velocity: {
                            vx: PlayerLogic.STARTING_VEL_X,
                            vy: PlayerLogic.STARTING_VEL_Y
                        },
                        rectangle: {
                            bottomLeft: {
                                x: bottomLeft.x,
                                y: bottomLeft.y
                            },
                            bottomRight: {
                                x: bottomLeft.x + PlayerLogic.PLAYER_WIDTH,
                                y: bottomLeft.y,
                            },
                            topLeft: {
                                x: bottomLeft.x,
                                y: bottomLeft.y - PlayerLogic.PLAYER_HEIGHT,
                            },
                            topRight: {
                                x: bottomLeft.x + PlayerLogic.PLAYER_WIDTH,
                                y: bottomLeft.y - PlayerLogic.PLAYER_HEIGHT,
                            },
                        }
                    }
                }; 
            }
            
            return {
                ...state,
                [id] : {
                    ...entityState,
                    isOnstage,
                    rectangle: newRectangle,
                    velocity,
                    knockbackTicks,
                    numTicksInactive,
                    numTicksAlive,
                    chargeCounter,
                }
            };
            // handle this in weapon reducer.
            // this.weapon.tick(this.getWeaponOrigin(this.directionFacing), this.directionFacing);
        }
        case ADD_ENTITY: {
            const { id, name, baseColor } = action.payload;
            return {
                ...state,
                [id] : {
                    id,
                    name,
                    baseColor,
                    health: PlayerLogic.STARTING_HEALTH,
                    mana: PlayerLogic.STARTING_MANA,
                    rectangle: {
                        bottomLeft: {
                            x: PlayerLogic.STARTING_POS_X,
                            y: PlayerLogic.STARTING_POS_Y
                        },
                        bottomRight: {
                            x: PlayerLogic.STARTING_POS_X + PlayerLogic.PLAYER_WIDTH,
                            y: PlayerLogic.STARTING_POS_Y,
                        },
                        topLeft: {
                            x: PlayerLogic.STARTING_POS_X,
                            y: PlayerLogic.STARTING_POS_Y - PlayerLogic.PLAYER_HEIGHT,
                        },
                        topRight: {
                            x: PlayerLogic.STARTING_POS_X + PlayerLogic.PLAYER_WIDTH,
                            y: PlayerLogic.STARTING_POS_Y - PlayerLogic.PLAYER_HEIGHT,
                        },
                    },
                    velocity: {
                        vx: PlayerLogic.STARTING_VEL_X,
                        vy: PlayerLogic.STARTING_VEL_Y
                    },
                    isOnstage: true,
                    directionMoving: Direction.STOP,
                    directionFacing: (id % 2 === 0) ? Direction.RIGHT : Direction.LEFT,
                    numLives: PlayerLogic.STARTING_LIVES,
                    chargeCounter: 0,
                    isCharging: false,
                    isBlocking: false,
                    knockbackTicks: 0,
                    numTicksAlive: 0,
                    isAlive: true,
                    numTicksInactive: 0,
                }
            };
        }
        default:
            return state;
    }
}