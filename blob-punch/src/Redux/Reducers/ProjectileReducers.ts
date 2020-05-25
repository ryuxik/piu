import {ProjectileState} from '../States';
import { ProjectileActionTypes, ADD_PROJECTILE, REMOVE_PROJECTILE, TICK, COLLIDE } from '../Actions/ProjectileActionTypes';
import { PlayerLogic, GameLogic } from '../../Constants';
import { Direction } from '../../CommonEnums';
import { MoveRectangle } from '../../Utils/PhysicsUtils';

const initialState : Map<number, Map<number, ProjectileState>> = new Map();

export function projectileReducer(state = initialState, action: ProjectileActionTypes): Map<number, Map<number, ProjectileState>> {
    switch(action.type) {
        case ADD_PROJECTILE: {
            const {
                id,
                entityId,
                bottomLeft,
                direction
            } = action.payload;
            return {
                ...state,
                [entityId] : {
                    ...state.get(entityId),
                    [id] : {
                        id,
                        entityId,
                        connectionMade: false,
                        garbageCollect: false,
                        rectangle: {
                                bottomLeft: {
                                    x: bottomLeft.x,
                                    y: bottomLeft.y
                                },
                                bottomRight: {
                                    x: bottomLeft.x + PlayerLogic.PROJECTILE_WIDTH,
                                    y: bottomLeft.y,
                                },
                                topLeft: {
                                    x: bottomLeft.x,
                                    y: bottomLeft.y - PlayerLogic.PROJECTILE_HEIGHT,
                                },
                                topRight: {
                                    x: bottomLeft.x + PlayerLogic.PROJECTILE_WIDTH,
                                    y: bottomLeft.y - PlayerLogic.PROJECTILE_HEIGHT,
                                },
                        },
                        velocityVector:{
                            vx: direction === Direction.RIGHT ? PlayerLogic.PROJECTILE_VEL_X: -PlayerLogic.PROJECTILE_VEL_X,
                            vy: 0,
                        }
                    }
                }
            };
        }
        case REMOVE_PROJECTILE: {
            const {
                id,
                entityId
            } = action.payload;
            let newMap = state.get(entityId)!;
            newMap.delete(id);

            return {
                ...state,
                [entityId] : {
                    ...newMap
                }
            }
        }
        case TICK: {
            const {
                id,
                entityId
            } = action.payload;
            const projectileState = state.get(entityId)!.get(id)!;
            const rectangle = MoveRectangle(projectileState.rectangle, projectileState.velocity);
            const garbageCollect = rectangle.bottomRight.x <  0 || rectangle.bottomLeft.x >  GameLogic.WIDTH;
            // collision detection
            // if (!this.connectionMade) {
            //     if (CollisionRectRect(this.rectangle, this.opponent.rectangle)) {
            //         this.opponent.takePiu((this.velocityVector.vx < 0 ? Direction.LEFT : Direction.RIGHT));
            //         this.connectionMade = true;
            //         if (this.entityManager) {
            //             this.entityManager.removeEntity(this);
            //         }
            //     }
            // }
            return {
                ...state,
                [entityId] : {
                    ...state.get(entityId),
                    [id] : {
                        ...projectileState,
                        rectangle,
                        garbageCollect
                    }
                }
            };
        }
        case COLLIDE: {
            const {
                id,
                entityId
            } = action.payload;
            return {
                ...state,
                [entityId] : {
                    ...state.get(entityId),
                    [id] : {
                        ...state.get(entityId)!.get(id),
                        connectionMade: true,
                    }
                }
            }
        }
        default:
            return state;

    }
}