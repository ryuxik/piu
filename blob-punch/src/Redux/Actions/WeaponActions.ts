import { WeaponActionTypes, ADD_WEAPON, TICK, ATTACK } from "./WeaponActionTypes";
import { Coordinate2DInterface } from "../../CommonInterfaces/Physics";
import { Direction } from "../../CommonEnums";

export function addWeapon(id: number, bottomLeft: Coordinate2DInterface): WeaponActionTypes {
    return {
        type: ADD_WEAPON,
        payload: {
            id,
            bottomLeft
        }
    };
}

export function tick(id: number, bottomLeft: Coordinate2DInterface, direction: Direction): WeaponActionTypes {
    return {
        type: TICK,
        payload: {
            id,
            bottomLeft,
            direction
        }
    };
}

export function attack(id: number, direction: Direction): WeaponActionTypes {
    return {
        type: ATTACK,
        payload: {
            id,
            direction
        }
    };
}