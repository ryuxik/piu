import { Direction } from "../../CommonEnums";

export const START_BLOCK = 'START_BLOCK';
export const RELEASE_BLOCK = 'RELEASE_BLOCK';
export const JUMP = 'JUMP';
export const TAKE_DAMAGE = 'TAKE_DAMAGE';
export const ATTACK = 'ATTACK';
export const ALT_ATTACK = 'ALT_ATTACK';
export const CHARGE_MANA = 'CHARGE_MANA';
export const ADD_MANA = 'ADD_MANA';
export const START_LEFT = 'MOVE_LEFT';
export const STOP_LEFT = 'STOP_LEFT';
export const START_RIGHT = 'START_RIGHT';
export const STOP_RIGHT = 'STOP_RIGHT';
export const RESPAWN = 'RESPAWN'; 
export const TICK = 'TICK';
export const ADD_ENTITY = 'ADD_ENTITY';

interface StartBlockAction {
    type: typeof START_BLOCK,
    payload: { 
        id: number
    }
}

interface ReleaseBlockAction {
    type: typeof RELEASE_BLOCK,
    payload: { 
        id: number
    }
}

interface JumpAction {
    type: typeof JUMP,
    payload: { 
        id: number
    }
}

interface TakeDamageAction {
    type: typeof TAKE_DAMAGE,
    payload: { 
        id: number, 
        direction: Direction, 
        damage: number 
    }
}

interface AttackAction {
    type: typeof ATTACK,
    payload: { 
        id: number
    }
}

interface AltAttackAction {
    type: typeof ALT_ATTACK,
    payload: { 
        id: number
    }
}

interface ChargeManaAction {
    type: typeof CHARGE_MANA,
    payload: { 
        id: number
    }
}

interface AddManaAction {
    type: typeof ADD_MANA,
    payload: {
        id: number
    }
}

interface StartLeftAction {
    type: typeof START_LEFT,
    payload: { 
        id: number
    }
}

interface StopLeftAction {
    type: typeof STOP_LEFT,
    payload: {
        id: number
    }
}

interface StartRightAction {
    type: typeof START_RIGHT,
    payload: {
        id: number
    }
}

interface StopRightAction {
    type: typeof STOP_RIGHT,
    payload: { 
        id: number
    }
}

interface RespawnAction {
    type: typeof RESPAWN,
    payload: {
        id: number
    }
}

interface TickAction {
    type: typeof TICK,
    payload: { 
        id: number
    }
}

interface AddEntityAction {
    type: typeof ADD_ENTITY,
    payload: {
        id: number,
        name: string,
		baseColor: readonly number[],
    }
}

export type PlayerActionTypes =
    StartBlockAction | ReleaseBlockAction | JumpAction | TakeDamageAction | AttackAction | AltAttackAction |
    ChargeManaAction | AddManaAction | StartLeftAction | StopLeftAction | StartRightAction | StopRightAction |
    RespawnAction | TickAction | AddEntityAction;