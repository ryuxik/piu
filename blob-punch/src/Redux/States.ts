import { RectangleInterface, Vector2DInterface } from '../CommonInterfaces/Physics';
import { Direction } from '../CommonEnums';
import { KeyBindings } from '../CommonInterfaces/Controller';
import { GameState } from '../GameRunner';

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

export interface RootState {
    gameState: GameState;
    numTicksActive: number;
    entitiesById: Map<number, EntityState>;
    entities: Array<number>;
    projectilesById: Map<number, Map<number, ProjectileState>>;
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
    id: number;
    canvas: HTMLElement;
}

export interface EntityState extends SolidState {
    baseColor: readonly number[];
    velocity: Vector2DInterface;
    name: string;
    health: number;
    mana: number;
    directionMoving: Direction;
    directionFacing: Direction;
    numLives: number;
    chargeCounter: number;
    isCharging: boolean;
    isBlocking: boolean;
    isAlive: boolean;
    isOnstage: boolean;
    knockbackTicks: number;
    numTicksAlive: number;
	numTicksInactive: number;
    id: number;
}

export interface EntityManagerState {
    entities: Array<number>;
    projectiles: Array<number>;
    canvas: HTMLCanvasElement;
}

export interface WeaponState extends SolidState {
    isAttacking: boolean;
    isColliding: boolean;
    attackingTick: number;
    direction: Direction;
    id: number;
}

export interface ProjectileState extends SolidState {
    velocity: Vector2DInterface;
    connectionMade: boolean;
    garbageCollect: boolean;
    id: number;
    entityId: number;
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