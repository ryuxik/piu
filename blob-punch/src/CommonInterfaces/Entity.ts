import { Direction, Action } from '../CommonEnums';
import { RectangleInterface, Coordinate2DInterface, Vector2DInterface } from './Physics';

// Entity Roles

/**
 * The interface for entities which are able to collide.
 * 
 * @interface
 * @property {RectangleInterface} rectangle - The rectangle representing the space which the entity takes up.
 * @property {(Vector2DInterface?) => void} updatePosition - The function which handles updating the position of the entity.
 */
export interface SolidInterface {
	rectangle: RectangleInterface;
	updatePosition(updateVector?: Vector2DInterface): void;
}

/**
 * The interface for entities which are controllable.
 * 
 * @interface
 * @property {EntityManagerInterface} [entityManager] - The manager of this entity.
 * @property {(EntityManagerInterface) => void} registerEntityManager - The function which registers a manager for this entity.
 */
export interface ManagedInterface {
	entityManager?: EntityManagerInterface,
	registerEntityManager(entityManager: EntityManagerInterface): void;
}

/**
 * The interface for displaying information about an entity.
 * 
 * @interface
 * @augments RendererInterface
 * @property {EntityInterface} entity - The entity for which the information is displayed.
 * @property {number} entityNumber - The number of the entity for which the information is displayed.
 */
export interface EntityInformationInterface extends RendererInterface {
	entity: EntityInterface;
	entityNumber: number;
}

/**
 * The interface for a normal game entity.
 * 
 * @interface
 * @augments SolidInterface
 * @augments ManagedInterface
 * @property {string} name - The name of this entity.
 * @property {number} health - The health points of this entity.
 * @property {number} mana - The mana points of this entity.
 * @property {boolean} isOnstage - Flag indicating whether the entity lies somewhere over the play stage.
 * @property {Direction} directionMoving - The direction in which this entity is moving.
 * @property {Direction} directionFacing - The direction in which this entity is facing.
 * @property {number} numLives - The number of lives this entity has remaining.
 * @property {number} chargeCounter - The number of game ticks for which this entity has been charging mana.
 * @property {boolean} isCharging - Flag indicating if the entity is charging mana.
 * @property {boolean} isBlocking - Flag indicating if the entity is blocking attacks.
 * @property {number} knockbackTicks - The number of game ticks remaining for which this entity will suffer knckback.
 * @property {number} numTicksAlive - The number of game ticks for which this entity has not lost a life.
 * @property {EntityWeaponInterface} weapon - The weapon which this entity uses for attacking.
 * @property {EntityInformationInterface} info - The object in charge of displaying information about this entity.
 * @property {EntityInterface} [opponent] - The opponent which this interface will be fighting againts.
 * @property {() => number} getFitness - Method for getting the heuristic which approximates how well this
 * entity is doing.
 * @property {(EntityInterface) => void} registerOponent - Method for registering an opponent for this entity.
 * @property {() => void} resetManaCounter - Method for resetting the mana points of this entity to the start
 * amount determined by the game rules.
 * @property {(boolean) => void} setOnstage - Method for modifying the isOnstage flag.
 * @property {() => void} block - Method for starting this entity's attack blocking.
 * @property {() => void} releaseBlock - Method for ending this entity's attack blocking.
 * @property {() => void} jump - Method for starting this entity's jumping.
 * @property {(Direction, number) => void} takeKnockback - Method for making this entity suffer knockback damage.
 * @property {(Direction) => void} takePunch - Method for making this entity take a punch.
 * @property {(Direction) => void} takePiu - Method for making this entity take a piu.
 * @property {(number) => void} takeDamage - Method for making this entity take damage.
 * @property {() => void} attack - Method for making this entity perform an attack.
 * @property {() => void} altAttack - Method for making this entity perform an alternative attack.
 * @property {() => void} chargeMana - Method for making this entity start a process which rewards a variable
 * amount of mana points depending on the charging duration.
 * @property {() => void} addMana - Method for adding the mana currently in the entity's charing pool.
 * @property {(Action) => void} takeAction - Method for making this entity take an action.
 * @property {(Direction) => void} takeDirection - Method for making this entity take a direction.
 * @property {() => number} getCommandedXVel - Method for getting this entity's x velocity.
 * @property {() => void} respawn - Method for resetting this entity to its original spawn point
 * if it has any lives remaining.
 */
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

/**
 * The interface for an entity manager, responsible for multiple entities' rendering and position updates.
 * 
 * @interface
 * @property {Set<(EntityInterface | ProjectileInterface) & RendererInterface>} entities -
 * The entities which this manager is responsible for.
 * @property {(EntityInterface | ProjectileInterface) => void} removeEntity -
 * Removes this entity from the control of the manager.
 * @property {(EntityInterface | ProjectileInterface) => void} addEntity -
 * Adds this entity to the control of the manager.
 * @property {() => void} updateEntityPositions -
 * Updates the positions of all the entities under control of this manager.
 * @property {(HTMLCanvasElement) => void} drawEntities -
 * Renders all the entities under the control of this manager onto the canvas.
 */
export interface EntityManagerInterface {
	entities: Set<(EntityInterface | ProjectileInterface) & RendererInterface>;
	removeEntity(entity: EntityInterface | ProjectileInterface): void;
	addEntity(entity: EntityInterface | ProjectileInterface): void;
	updateEntityPositions(): void;
	drawEntities(canvas: HTMLCanvasElement): void;
}

/**
 * The interface for a weapon.
 * 
 * @interface
 * @augments SolidInterface
 * @augments RendererInterface
 * @property {EntityInterface} [opponent] - The entity which this weapon will harm.
 * @property {(EntityInterface) => void} registerOponent - Method for registering the opponent of this weapon.
 * @property {(Direction) => void} attack - Method for making weapon attack with the indicated direction.
 * @property {(Coordinate2DInterface, Direction) => void} tick - Method for making the weapon update.
 */
export interface EntityWeaponInterface extends SolidInterface, RendererInterface {
	opponent?: EntityInterface;
	registerOpponent(opponent: EntityInterface): void;
	attack(direction : Direction): void;
	tick(bottomLeft: Coordinate2DInterface, direction: Direction): void;
}

/**
 * The interface for a projectile.
 * 
 * @interface
 * @augments SolidInterface
 * @augments ManagedInterface
 */
export interface ProjectileInterface extends SolidInterface, ManagedInterface {
}

// Renderers

/**
 * The interface for a rendered entity.
 * 
 * @interface
 * @property {() => readonly number[]} getBaseColor - Returns the rgb triple for the color of this entity.
 * @property {(HTMLCanvasElement) => void} draw - Draws this entity of the canvas.
 */
export interface RendererInterface {
	getBaseColor(): readonly number[];
	draw(canvas: HTMLCanvasElement): void;
}

// Constructors

/**
 * The constructor for a projectile.
 *
 * @constructor
 * @param {Coordinate2DInterface} bottomLeft - The coordinate of the bottom left corner of the rectangle for this projectile.
 * @param {Direction} direction - The direction in which this projectile will move.
 * @param {EntityInterface} opponent - The opponent which this projectile will harm if it makes contact.
 */
export interface ProjectileConstructor {
	new (bottomLeft: Coordinate2DInterface, direction: Direction, opponent: EntityInterface): ProjectileInterface;
}

/**
 * The constructor for a normal game entity.
 * 
 * @constructor
 * @param {Coordinate2DInterface} bottomLeft - The coordinate of the bottom left corner of the rectangle for this projectile.
 * @param {string} name - The name of this entity.
 * @param {number[]} color - The color of this entity.
 * @param {number} entityNumber - The number of this entity.
 */
export interface EntityConstructor {
	new (bottomLeft: Coordinate2DInterface, name: string, color: number[], entityNumber: number) : EntityInterface;
}

/**
 * The constructor for a weapon.
 * 
 * @constructor
 * @param {Coordinate2DInterface} bottomLeft - The coordinate of the bottom left corner of the rectangle for this weapon.
 */
export interface EntityWeaponConstructor {
	new (bottomLeft: Coordinate2DInterface): EntityWeaponInterface;
}

// Factories

/**
 * The factory for creating ProjectileInterfaces.
 * 
 * @constructs ProjectileInterface
 * @param {ProjectileConstructor} ctor - The projectile constructor.
 * @param {Coordinate2DInterface} bottomLeft - The coordinate of the bottom left corner of the rectangle for this projectile.
 * @param {Direction} direction - The direction which the projectile will take.
 * @param {EntityInterface} opponent - The opponent which the projectile will damage if it makes contact.
 */
export function createProjectile(ctor: ProjectileConstructor, bottomLeft: Coordinate2DInterface, direction: Direction, opponent: EntityInterface): ProjectileInterface {
	return new ctor(bottomLeft, direction, opponent);
}

/**
 * The factory for creating EntityInterfaces.
 * 
 * @constructs EntityInterface
 * @param {EntityConstructor} ctor - The entity constructor.
 * @param {Coordinate2DInterface} bottomLeft - The coordinate of the bottom left corner of the rectangle for this entity.
 * @param {string} name - The name of this entity. 
 * @param {number[]} color - The color of this entity. 
 * @param {number} entityNumber - The number of this entity.
 */
export function createEntity(ctor: EntityConstructor, bottomLeft: Coordinate2DInterface, name: string, color: number[], entityNumber: number): EntityInterface {
	return new ctor(bottomLeft, name, color, entityNumber);
}

/**
 * The factory for creating EntityWeaponInterfaces.
 * 
 * @constructs EntityWeaponInterface
 * @param {EntityWeaponConstructor} ctor - The weapon constructor.
 * @param {Coordinate2DInterface} bottomLeft - The coordinate of the bottom left corner of the rectangle for this weapon.
 */
export function createEntityWeapon(ctor: EntityWeaponConstructor, bottomLeft: Coordinate2DInterface): EntityWeaponInterface {
	return new ctor(bottomLeft);
}