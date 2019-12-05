import { Direction, Action } from './CommonEnums';

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

export interface EntityInfoRendererInterface {
	draw(canvas: HTMLCanvasElement): void;
}

export interface EntityRendererInterface {
	draw(canvas: HTMLCanvasElement): void;
}

export interface EntityWeaponRendererInterface {
	draw(canvas: HTMLCanvasElement): void;
}

export interface EntityConstructor {
	new (name: string, color: number[], entityNumber: number) : EntityInterface;
}

export interface EntityWeaponConstructor {
	new (): EntityWeaponInterface;
}

export function createEntity(ctor: EntityConstructor, name: string, color: number[], entityNumber: number): EntityInterface {
	return new ctor(name, color, entityNumber);
}

export function createEntityWeapon(ctor: EntityWeaponConstructor): EntityWeaponInterface {
	return new ctor();
}