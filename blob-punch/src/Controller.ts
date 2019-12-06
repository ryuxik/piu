import { EntityInterface } from './Entity';

export interface KeyBindings {
	left: number;
	right: number;
	jump: number;
	charge: number;
	attack: number;
	altAttack: number;
	block: number;
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