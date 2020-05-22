import { EntityInterface } from './Entity';

/**
 * The interface for the key bindings of game entities.
 * 
 * @interface
 * @property {number} left      - The key binding for the move left action.
 * @property {number} right     - The key binding for the move right action.
 * @property {number} jump      - The key binding for the jump action.
 * @property {number} charge    - The key binding for the charge mana action.
 * @property {number} attack    - The key binding for the attack action.
 * @property {number} altAttack - The key binding for the alternative attack action.
 * @property {number} block     - The key binding for the block attack action.
 */
export interface KeyBindings {
	readonly left: number;
	readonly right: number;
	readonly jump: number;
	readonly charge: number;
	readonly attack: number;
	readonly altAttack: number;
	readonly block: number;
}

/**
 * The constructor for a class implementing the ControllerInterface.
 * 
 * @constructor
 * @param {EntityInterface} entity  - The entity to be controlled.
 * @param {KeyBindings} keyBindings - The key bindings for the entity.
 */
export interface ControllerConstructor {
	new (entity: EntityInterface, keyBindings: KeyBindings): ControllerInterface;
}

/**
 * The interface for an entity controller.
 * 
 * @interface
 * @property {(number) => void} keyPressed - The handler for entity key press actions.
 * @property {(number) => void} keyCode    - The handler for entity key release actions.
 */
export interface ControllerInterface {
	keyPressed(keyCode: number): void;
	keyReleased(keyCode: number): void;
}

/**
 * The factory for creating ControllerInterfaces.
 * 
 * @constructs ControllerInterface
 * @param ctor        - The controller contructor.
 * @param entity      - The entity to be controlled.
 * @param keyBindings - The key bindings for the entity.
 */
export function createController(ctor: ControllerConstructor, entity: EntityInterface, keyBindings: KeyBindings): ControllerInterface {
	return new ctor(entity, keyBindings);
}