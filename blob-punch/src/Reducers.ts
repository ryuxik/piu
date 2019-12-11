import { RectangleInterface, Vector2DInterface } from './CommonInterfaces/Physics';
import { Direction } from './CommonEnums';
import { KeyBindings } from './CommonInterfaces/Controller';
import { GameState } from './GameRunner';

export const initialState : RootState = {
    gameState: GameState.STANDBY,
    entities: [],
    entitiesById: new Map(),
    projectiles: [],
    projectilesById: new Map(),
    controllers: [],
    controllersById: new Map(),
    numTicksActive: 0, 
} 

export const piuApp = (state = initialState, action) => {
    return state;
}


export interface RootState {
    gameState: GameState;
    numTicksActive: number;
    entitiesById: Map<number, EntityState>;
    entities: Array<number>;
    projectilesById: Map<number, ProjectileState>;
    projectiles: Array<number>;
    controllersById: Map<number, ControllerState>;
    controllers: Array<number>;
    // use listener on numticksactive
    //drawCallback?: (entityManager: EntityManagerState) => void;
    // use listener on gameState
    //stateChangeCallback?: (gameState: GameState) => void;
    ticker?: NodeJS.Timeout;
    canvas?: HTMLCanvasElement;
}

export interface SolidState {
    rectangle:  RectangleInterface;
}

export interface EntityInformationState {
    entity: number;
    entityNumber: number;
    canvas: HTMLElement;
}

export interface EntityState extends SolidState {
    baseColor: readonly number[];
    velocity: Vector2DInterface;
    name: string;
    health: number;
    mana: number;
    entityNumber: number;
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
	weapon: number;
	info: number;
    opponent: number;
    canvas: HTMLCanvasElement;
}

export interface EntityManagerState {
    entities: Array<number>;
    projectiles: Array<number>;
    canvas: HTMLCanvasElement;
}

export interface EntityWeaponState extends SolidState {
    isAttacking: boolean;
    isColliding: boolean;
    attackingTick: number;
    direction: Direction;
    opponent: number;
    entity: number;
    canvas: HTMLCanvasElement;
}

export interface ProjectileState extends SolidState {
    velocityVector: Vector2DInterface;
	opponent: number;
    connectionMade: boolean;
    canvas: HTMLCanvasElement;
}


export interface ControllerState {
    entity: number;
    leftArrowActive: boolean;
    rightArrowActive: boolean;
    keyBindings: KeyBindings;
}

export interface ProviderState {
    entities: Array<number>;
    controllers: Array<number>;
}

export interface PiuAppState {
    gameState: GameState;
}

export interface GameRunnerState {
    entities: Array<number>;
    controllers: Array<number>;
    ticker: NodeJS.Timeout;
    numTicksActive: number;
    gameState: GameState;
}