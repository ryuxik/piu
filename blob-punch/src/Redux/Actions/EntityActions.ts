import {
    PlayerActionTypes,
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
    TICK,
    ADD_ENTITY
} from "./EntityActionTypes";
import { Direction } from "../../CommonEnums";

export function startBlock(id: number): PlayerActionTypes {
    return {
        type: START_BLOCK,
        payload: {
            id
        }
    }
}

export function releaseBlock(id: number): PlayerActionTypes {
    return {
        type: RELEASE_BLOCK,
        payload: {
            id
        }
    }
}

export function jump(id: number): PlayerActionTypes {
    return {
        type: JUMP,
        payload: {
            id
        }
    }
}

export function takeDamage(id: number, direction: Direction, damage: number): PlayerActionTypes {
    return {
        type: TAKE_DAMAGE,
        payload: {
            id,
            direction,
            damage
        }
    }
}

export function attack(id: number): PlayerActionTypes {
    return {
        type: ATTACK,
        payload: {
            id
        }
    }
}

export function altAttack(id: number): PlayerActionTypes {
    return {
        type: ALT_ATTACK,
        payload: {
            id
        }
    }
}

export function chargeMana(id: number): PlayerActionTypes {
    return {
        type: CHARGE_MANA,
        payload: {
            id
        }
    }
}

export function addMana(id: number): PlayerActionTypes {
    return {
        type: ADD_MANA,
        payload: {
            id
        }
    }
}

export function startLeft(id: number): PlayerActionTypes {
    return {
        type: START_LEFT,
        payload: {
            id
        }
    }
}

export function stopLeft(id: number): PlayerActionTypes {
    return {
        type: STOP_LEFT,
        payload: {
            id
        }
    }
}

export function startRight(id: number): PlayerActionTypes {
    return {
        type: START_RIGHT,
        payload: {
            id
        }
    }
}

export function stopRight(id: number): PlayerActionTypes {
    return {
        type: STOP_RIGHT,
        payload: {
            id
        }
    }
}

export function respawn(id: number): PlayerActionTypes {
    return {
        type: RESPAWN,
        payload: {
            id
        }
    }
}

export function tick(id: number): PlayerActionTypes {
    return {
        type: TICK,
        payload: {
            id
        }
    }
}

export function addEntity(id: number, name: string, baseColor: readonly number[]): PlayerActionTypes {
    return {
        type: ADD_ENTITY,
        payload: {
            id,
            name,
            baseColor
        }
    }
}