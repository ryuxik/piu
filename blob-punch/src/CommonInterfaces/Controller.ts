import { EntityInterface } from './Entity';

export interface KeyBindings {
	readonly left: number;
	readonly right: number;
	readonly jump: number;
	readonly charge: number;
	readonly attack: number;
	readonly altAttack: number;
	readonly block: number;
}

export interface ControllerConstructor {
	new (entity: EntityInterface, keyBindings: KeyBindings): ControllerInterface;
}

export interface ControllerInterface {
	keyPressed(keyCode: number): void;
	keyReleased(keyCode: number): void;
}

export function createController(ctor: ControllerConstructor, entity: EntityInterface, keyBindings: KeyBindings): ControllerInterface {
	return new ctor(entity, keyBindings);
}