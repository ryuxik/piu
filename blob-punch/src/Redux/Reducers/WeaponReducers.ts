import { WeaponState } from "../States";
import { WeaponActionTypes, ADD_WEAPON, ATTACK, TICK } from "../Actions/WeaponActionTypes";
import { PlayerLogic } from "../../Constants";
import { Direction } from "../../CommonEnums";

const initialState : Map<number, WeaponState> = new Map();

export function weaponReducer(state = initialState, action: WeaponActionTypes): Map<number, WeaponState> {
    switch(action.type) {
        case ADD_WEAPON: {
            const { id, bottomLeft } = action.payload;
            return {
                ...state,
                [id] : {
                    id,
                    isAttacking: false,
                    attackingTick: 0,
                    isColliding: false,
                    rectangle: {
                        bottomLeft,
                        bottomRight: {
                            x: bottomLeft.x,
                            y: bottomLeft.y,
                        },
                        topLeft: {
                            x: bottomLeft.x,
                            y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
                        },
                        topRight: {
                            x: bottomLeft.x,
                            y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
                        },
                    },
                    direction: Direction.STOP,
                }
            }

        }
        case ATTACK: {
            const { id, direction } = action.payload;
            return {
                ...state,
                [id] : {
                    ...state.get(id),
                    attackingTick: 0,
                    isAttacking: true,
                    isColliding: false,
                    direction
                }
            }
        }
        case TICK: {
            const { id, bottomLeft, direction } = action.payload;
            const weaponState = state.get(id)!;
            let attackingTick = weaponState.attackingTick;
            attackingTick++;
            if (!weaponState.isAttacking) {
                return state;
            }
            if (attackingTick > PlayerLogic.ARM_SPEED * 2) {
                return  {
                    ...state,
                    [id]: {
                        ...weaponState,
                        isAttacking: false,
                        attackingTick,
                        rectangle: {
                            bottomLeft,
                            bottomRight: {
                                x: bottomLeft.x,
                                y: bottomLeft.y,
                            },
                            topLeft: {
                                x: bottomLeft.x,
                                y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
                            },
                            topRight: {
                                x: bottomLeft.x,
                                y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
                            },
                        }
                    }
                }
            }
    
            let extension: number;
            // TODO: check this logic
            if (attackingTick < PlayerLogic.ARM_SPEED) { // weapon is moving out
                extension = ( attackingTick / PlayerLogic.ARM_SPEED ) * PlayerLogic.ARM_REACH;
            } else { // weapon is moving in
                extension = ( PlayerLogic.ARM_SPEED * 2 - attackingTick ) / ( PlayerLogic.ARM_SPEED * PlayerLogic.ARM_REACH ); 
            }
            switch (direction) {
                case Direction.RIGHT:
                        return {
                            ...state,
                            [id]: {
                                ...weaponState,
                                attackingTick,
                                direction,
                                rectangle: {
                                    bottomLeft,
                                    bottomRight: {
                                        x: bottomLeft.x + extension,
                                        y: bottomLeft.y,
                                    },
                                    topLeft: {
                                        x: bottomLeft.x,
                                        y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
                                    },
                                    topRight: {
                                        x: bottomLeft.x + extension,
                                        y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
                                    },
                                }
                            }
                        } 
                case Direction.LEFT:
                    return {
                        ...state,
                        [id]: {
                            ...weaponState,
                            attackingTick,
                            direction,
                            rectangle: {
                                bottomLeft: {
                                    x: bottomLeft.x - extension,
                                    y: bottomLeft.y,
                                },
                                bottomRight: {
                                    x: bottomLeft.x,
                                    y: bottomLeft.y,
                                },
                                topLeft: {
                                    x: bottomLeft.x - extension,
                                    y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
                                },
                                topRight: {
                                    x: bottomLeft.x,
                                    y: bottomLeft.y - PlayerLogic.ARM_HEIGHT,
                                },
                            }
                        }
                    }
                default:
                    console.log("should never get here");
                    return {
                        ...state,
                        [id]: {
                            ...weaponState,
                            attackingTick,
                            direction
                        }
                    }
            }  
        }
        default:
            return state;
    }
}