import { Direction, Action } from './CommonEnums';

// Entity Types

export interface EntityInterface {
	getFitness(): number;
	setOponent(opponent: EntityInterface): void;
	resetManaCounter(): void;
	setOnstage(): void;
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
	updatePosition(): void;
	setEntityManager(entityManager: any): void;
}

export interface EntityManagerInterface {
	removeEntity(entity: EntityInterface): void;
	addEntity(entity: EntityInterface): void;
	updateEntityPositions(): void;
	drawEntities(canvas: HTMLCanvasElement): void;
}

export interface EntityWeaponInterface {
	attack(): void;
	tick(): void;
}

export interface ProjectileInterface {
	setEntityManager(entityManager: EntityManagerInterface): void;
	updatePosition(): void;
}

// Renderers

export interface RendererInterface {
	draw(canvas: HTMLCanvasElement): void;
}

// Constructors

export interface ProjectileConstructor {
	new (x: number, y: number, direction: Direction, opponent: EntityInterface): ProjectileInterface;
}

export interface EntityConstructor {
	new (name: string, color: number[], entityNumber: number) : EntityInterface;
}

export interface EntityWeaponConstructor {
	new (): EntityWeaponInterface;
}

// Factories

export function createProjectile(ctor: ProjectileConstructor, x: number, y: number, direction: Direction, opponent: EntityInterface): ProjectileInterface {
	return new ctor(x, y, direction, opponent);
}

export function createEntity(ctor: EntityConstructor, name: string, color: number[], entityNumber: number): EntityInterface {
	return new ctor(name, color, entityNumber);
}

export function createEntityWeapon(ctor: EntityWeaponConstructor): EntityWeaponInterface {
	return new ctor();
}