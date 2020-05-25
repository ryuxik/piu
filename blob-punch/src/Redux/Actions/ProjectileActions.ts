import { ProjectileActionTypes, ADD_PROJECTILE, REMOVE_PROJECTILE, TICK, COLLIDE } from "./ProjectileActionTypes";
import { Coordinate2DInterface } from "../../CommonInterfaces/Physics";
import { Direction } from "../../CommonEnums";

export function addProjectile(id: number,
    entityId: number,
    bottomLeft: Coordinate2DInterface,
    direction: Direction): ProjectileActionTypes {
        return {
            type: ADD_PROJECTILE,
            payload: {
                id,
                entityId,
                bottomLeft,
                direction
            }
        }
    }

export function removeProjectile(id: number,
    entityId: number): ProjectileActionTypes {
        return {
            type: REMOVE_PROJECTILE,
            payload: {
                id,
                entityId
            }
        }
    }

export function tick(id: number, entityId: number) {
    return {
        type: TICK,
        payload: {
            id,
            entityId
        }
    }
}

export function collide(id: number, entityId: number) {
    return {
        type: COLLIDE,
        payload: {
            id,
            entityId
        }
    }
}