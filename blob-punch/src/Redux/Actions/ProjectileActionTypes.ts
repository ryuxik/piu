import { Coordinate2DInterface } from '../../CommonInterfaces/Physics';
import { Direction } from "../../CommonEnums";

export const ADD_PROJECTILE = 'ADD_PROJECTILE';
export const REMOVE_PROJECTILE = 'REMOVE_PROJECTILE';
export const TICK = 'TICK';
export const COLLIDE = 'COLLIDE';

interface AddProjectileAction {
    type: typeof ADD_PROJECTILE,
    payload: {
        id: number,
        entityId: number,
        bottomLeft: Coordinate2DInterface,
        direction: Direction
    }
}

interface RemoveProjectileAction {
    type: typeof REMOVE_PROJECTILE,
    payload: {
        id: number,
        entityId: number
    }
}

interface TickAction {
    type: typeof TICK,
    payload: {
        id: number,
        entityId: number,
    }
}

interface CollideAction {
    type: typeof COLLIDE,
    payload: {
        id: number,
        entityId: number
    }
}

export type ProjectileActionTypes = AddProjectileAction | RemoveProjectileAction | TickAction | CollideAction;