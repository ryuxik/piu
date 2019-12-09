import { EntityInterface, RendererInterface, EntityManagerInterface } from "../CommonInterfaces/Entity";
import { ControllerInterface, KeyBindings } from "../CommonInterfaces/Controller";
import { BaseEntity } from "../BaseImplementations/BaseEntity";
import { BaseController } from "../BaseImplementations/BaseController";
import { PlayerOneKeyBindings, PlayerTwoKeyBindings } from "./LocalKeyBindings";
import { GameRunner, GameState } from "../GameRunner";

export class LocalGameProvider {
    private entities: (EntityInterface & RendererInterface)[];
    private controllers: ControllerInterface[];
    private gameRunner: GameRunner;
    private gameStateChangeCallback: (gameState: GameState) => void;
    constructor(gameStateChangeCallback: (gameState: GameState) => void) {
        this.entities = this.initPlayers();
        this.controllers =
            this.initControllers(
                this.entities,
                [new PlayerOneKeyBindings(), new PlayerTwoKeyBindings()]);
        this.gameRunner = new GameRunner(this.entities, this.controllers, gameStateChangeCallback);
        this.gameStateChangeCallback = gameStateChangeCallback;
        document.addEventListener("keydown", this.onKeyPressed);
		document.addEventListener("keyup", this.onKeyReleased);
    }

    private initPlayers(): BaseEntity[] {
		let playerOne = new BaseEntity("playerOne", [250, 90, 73], 1);
		let playerTwo = new BaseEntity("playerTwo", [90, 250, 73], 2);
		playerOne.registerOponent(playerTwo);
		playerTwo.registerOponent(playerOne);
		return [playerOne, playerTwo];
    }
    
    private initControllers(players:(EntityInterface & RendererInterface)[], keyBindings: KeyBindings[]) {
		let controllers: BaseController[] = [];
		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			let controller = new BaseController(player, keyBindings[i]);
			controllers.push(controller);
		}
		return controllers;
    }
    
    private onKeyPressed = (e: KeyboardEvent) => {
		this.gameRunner.onKeyPressed(e.keyCode);
    }

    private onKeyReleased = (e: KeyboardEvent) => {
	    this.gameRunner.onKeyReleased(e.keyCode);
    }

    public startGame = (drawCallback: (entityManager: EntityManagerInterface) => void) : void => {
        this.gameRunner.registerDrawCallback(drawCallback);
        this.gameRunner.startGame();
    }

    public resetGame = (
        drawCallback: (entityManager: EntityManagerInterface) => void): void => {
        this.entities = this.initPlayers();
        this.controllers = this.initControllers(
            this.entities,
            [new PlayerOneKeyBindings(), new PlayerTwoKeyBindings()]);
        this.gameRunner = new GameRunner(this.entities, this.controllers, this.gameStateChangeCallback);
        this.gameRunner.registerDrawCallback(drawCallback);
        this.gameRunner.startGame();
    }

    public pauseGame = (): void => {
        this.gameRunner.pauseGame();
    }

    public resumeGame = (): void => {
        this.gameRunner.resumeGame();
    }

    public getGameState = (): GameState => {
        return this.gameRunner.getGameState();
    }
}