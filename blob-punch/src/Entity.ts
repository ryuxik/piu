export interface EntityInterface {
	getFitness(): number;
	setOponent(opponent: EntityInterface): void;
	resetManaCounter(): void;
	setOnstage(): void;
	block(): void;
	releaseBlock(): void;
	jump(): void;
	takeKnockback(direction: any, damage: any): void;
	takePunch(direction: any): void;
	takePiu(direction: any): void;
	takeDamage(damage: any): void;
	attack(): void;
	altAttack(): void;
	chargeMana(): void;
	addMana(): void;
	takeAction(action: any): void;
	takeDirection(direction: any): void;
	getCommandedXVel(): number;
	respawn(): void;
	updatePosition(): void;
	setEntityManager(entityManager: any): void;
}

export interface EntityWeaponInterface {
	attack(): void;
	tick(): void;
}

export interface EntityRendererInterface {
	draw(canvas: HTMLCanvasElement): void;
}

export interface EntityWeaponRendererInterface {
	draw(canvas: HTMLCanvasElement): void;
}

export interface EntityConstructor {
	new (name: string, color: any, entityNumber: number) : EntityInterface;
}

export interface EntityWeaponConstructor {
	new (): EntityWeaponInterface;
}

export function createEntity(ctor: EntityConstructor, name: string, color: any, entityNumber: number): EntityInterface {
	return new ctor(name, color, entityNumber);
}

export function createEntityWeapon(ctor: EntityWeaponConstructor): EntityWeaponInterface {
	return new ctor();
}