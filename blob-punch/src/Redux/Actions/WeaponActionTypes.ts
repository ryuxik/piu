import { Coordinate2DInterface } from "../../CommonInterfaces/Physics";
import { Direction } from "../../CommonEnums";

export const ADD_WEAPON = 'ADD_WEAPON';
export const ATTACK = 'ATTACK';
export const TICK = 'TICK';

interface AddWeaponAction {
    type: typeof ADD_WEAPON,
    payload: {
        id: number,
        bottomLeft: Coordinate2DInterface
    }
}

interface AttackAction {
    type: typeof ATTACK,
    payload: {
        id: number,
        direction: Direction
    }
}

interface TickAction {
    type: typeof TICK,
    payload: {
        id: number,
        bottomLeft: Coordinate2DInterface,
        direction: Direction
    }
}

export type WeaponActionTypes = AddWeaponAction | AttackAction | TickAction;