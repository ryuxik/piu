import { EntityInterface, EntityManagerInterface, RendererInterface } from "./CommonInterfaces/Entity";
import { ControllerInterface } from "./CommonInterfaces/Controller";
import { BaseEntityManger } from "./BaseImplementations/BaseEntityManager";
import { GameLogic } from "./Constants";

export enum GameState {
    STANDBY = 'standby',
    RUNNING = 'active',
    OVER    = 'over',
    PAUSED  = 'paused',
}

export class GameRunner {
    public entities: (EntityInterface & RendererInterface)[];
    public controllers: ControllerInterface[];
    public drawCallback?: (entityManager: EntityManagerInterface) => void;
    public endCallback: () => void;
    private ticker: NodeJS.Timeout;
    private numTicksActive: number;
    private gameState: GameState;
    private entityManager: EntityManagerInterface;

    constructor(
        entities: (EntityInterface & RendererInterface)[],
        controllers: ControllerInterface[],
        endCallback: () => void,
        drawCallback?: (entityManager: EntityManagerInterface) => void) {
        this.entities = entities;
        this.controllers = controllers;
        this.drawCallback = drawCallback;
        this.endCallback = endCallback;
        this.entityManager = new BaseEntityManger();
        entities.forEach((entity) => {
            this.entityManager.addEntity(entity);
        });
        this.gameState = GameState.STANDBY;
        this.numTicksActive = 0;
        this.ticker = setInterval(() => this.tick(), GameLogic.MS_PER_TICK);
    }

    public onKeyPressed = (keyCode: number) => {
        if (this.gameState === GameState.RUNNING) {
            if (keyCode === 80) { // p
                this.gameState = GameState.PAUSED;
            } else {
                this.controllers.forEach((controller) => {
                    controller.keyPressed(keyCode);
                });
            } 
        }
    }

    public onKeyReleased = (keyCode: number): void => {
        if (this.gameState === GameState.RUNNING) {
            this.controllers.forEach((controller) => {
                controller.keyReleased(keyCode);
            });
        } else if (this.gameState == GameState.PAUSED && keyCode === 80) { // p
            this.gameState = GameState.RUNNING;
        }
    }

    public startGame = (): GameRunner => {
        if (this.drawCallback) {
            this.drawCallback(this.entityManager);
        }
        this.gameState = GameState.RUNNING;
        return this;
    }

    public pauseGame = (): void => {
        if (this.gameState === GameState.RUNNING) {
            this.gameState = GameState.STANDBY;
        }
    }

    public resumeGame = (): void => {
        if (this.gameState === GameState.STANDBY) {
            this.gameState = GameState.RUNNING;
        }
    }

    public endGame = (): void => {
        this.gameState = GameState.OVER;
        this.numTicksActive = 0;
        clearInterval(this.ticker);
        this.endCallback();
    }

    public getNumTicksActive = (): number => {
        return this.numTicksActive;
    }

    public getGameState = (): GameState => {
        return this.gameState;
    }

    public tick = (): void => {
        if (this.gameState === GameState.RUNNING) {
            this.entityManager.updateEntityPositions();
            if (this.drawCallback) {
                this.drawCallback(this.entityManager);
            }
            for (let i = 0; i < this.entities.length; i++) {
                const entity = this.entities[i];
                if (!entity.isAlive) {
                    this.endGame();
                }
            }
            this.numTicksActive++;
        }
    }
}