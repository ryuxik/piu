import { EntityInterface } from './Entity';

export interface KeyBindings {
	left: number;
	right: number;
	jump: number;
	down: number;
	attack: number;
	altAttack: number;
	block: number;
}

export interface ControllerConstructor {
	new (entity: EntityInterface, keyBindings: KeyBindings): ControllerInterface;
}

export interface ControllerInterface {
	figureDirection(entity: EntityInterface): void;
	moveLeft(): void;
	moveRight(): void;
	stopLeft(): void;
	stopRight(): void;
	stop(): void;
	jump(): void;
	chargeMana(): void;
	attack(): void;
	altAttack(): void;
	addMana(): void;
	block(): void;
	releaseBlock(): void;
	keyPressed(keyCode: number): void;
	keyReleased(keyCode: number): void;
}

export function createController(ctor: ControllerConstructor, entity: EntityInterface, keyBindings: KeyBindings): ControllerInterface {
	return new ctor(entity, keyBindings);
}