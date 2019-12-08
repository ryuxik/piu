import { Direction, Action } from '../CommonEnums';
import { RectangleInterface, Coordinate2DInterface, Vector2DInterface } from './Physics';

// Entity Roles

export interface SolidInterface {
	rectangle: RectangleInterface;
	updatePosition(updateVector?: Vector2DInterface): void;
}

export interface ManagedInterface {
	entityManager: EntityManagerInterface,
}

export interface EntityInformationInterface extends RendererInterface {
	entity: EntityInterface;
	entityNumber: number;
}

export interface EntityInterface  extends SolidInterface, ManagedInterface {
	name: string;
	health: number;
	mana: number;
	isOnstage: boolean;
	directionMoving: Direction;
	directionFacing: Direction;
	numLives: number;
	chargeCounter: number;
	isCharging: boolean;
	isBlocking: boolean;
	knockbackTicks: number;
	numTicksAlive: number;
	isAlive: boolean;
	numTicksInactive: number;
	weapon: EntityWeaponInterface;
	info: EntityInformationInterface;
	opponent?: EntityInterface;
	getFitness(): number;
	registerOponent(opponent: EntityInterface): void;
	resetManaCounter(): void;
	setOnstage(isOnstage: boolean): void;
	block(): void;
	releaseBlock(): void;
	jump(): void;
	takeKnockback(direction: Direction, damage: number): void;
	takePunch(direction: Direction): void;
	takePiu(direction: Direction): void;
	takeDamage(damage: number): void;
	attack(): void;
	altAttack(): void;
	chargeMana(): void;
	addMana(): void;
	takeAction(action: Action): void;
	takeDirection(direction: Direction): void;
	getCommandedXVel(): number;
	respawn(): void;
}

export interface EntityManagerInterface {
	removeEntity(entity: EntityInterface | ProjectileInterface): void;
	addEntity(entity: EntityInterface | ProjectileInterface): void;
	updateEntityPositions(): void;
	drawEntities(canvas: HTMLCanvasElement): void;
}

export interface EntityWeaponInterface extends SolidInterface, RendererInterface {
	opponent?: EntityInterface;
	registerOpponent(opponent: EntityInterface): void;
	attack( direction : Direction ): void;
	tick(bottomLeft: Coordinate2DInterface, direction: Direction): void;
}

export interface ProjectileInterface extends SolidInterface, ManagedInterface {
}

// Renderers

export interface RendererInterface {
	getBaseColor(): readonly number[];
	draw(canvas: HTMLCanvasElement): void;
}

// Constructors

export interface ProjectileConstructor {
	new (bottomLeft: Coordinate2DInterface, direction: Direction, opponent: EntityInterface): ProjectileInterface;
}

export interface EntityConstructor {
	new (bottomLeft: Coordinate2DInterface, name: string, color: number[], entityNumber: number) : EntityInterface;
}

export interface EntityWeaponConstructor {
	new (bottomLeft: Coordinate2DInterface): EntityWeaponInterface;
}

// Factories

export function createProjectile(ctor: ProjectileConstructor, bottomLeft: Coordinate2DInterface, direction: Direction, opponent: EntityInterface): ProjectileInterface {
	return new ctor(bottomLeft, direction, opponent);
}

export function createEntity(ctor: EntityConstructor, bottomLeft: Coordinate2DInterface, name: string, color: number[], entityNumber: number): EntityInterface {
	return new ctor(bottomLeft, name, color, entityNumber);
}

export function createEntityWeapon(ctor: EntityWeaponConstructor, bottomLeft: Coordinate2DInterface): EntityWeaponInterface {
	return new ctor(bottomLeft);
}