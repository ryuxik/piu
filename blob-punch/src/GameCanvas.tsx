import React, {Component} from 'react';
import { ControllerInterface, KeyBindings } from './CommonInterfaces/Controller';
import { EntityInterface, EntityManagerInterface, RendererInterface } from './CommonInterfaces/Entity';
import { GameLogic, GameRender } from './Constants';
import { getRGBString } from './Utils/ColorUtil';
import { GameRunner, GameState } from './GameRunner';
import { BaseEntity } from './BaseImplementations/BaseEntity';
import { BaseController } from './BaseImplementations/BaseController';
import { PlayerOneKeyBindings, PlayerTwoKeyBindings } from './LocalPlay/LocalKeyBindings';

type GameCanvasProps = {
}

type GameCanvasState = {
	entities: (EntityInterface & RendererInterface)[],
	controllers: ControllerInterface[], 
	gameRunner: GameRunner,
}

class GameCanvas extends Component<GameCanvasProps, GameCanvasState> {
	private canvasRef : React.RefObject<HTMLCanvasElement> = React.createRef<HTMLCanvasElement>();
	constructor(props: GameCanvasProps) {
		super(props);
		this.state = this.getBaseState();
	}

	private initPlayers(): BaseEntity[] {
		let playerOne = new BaseEntity("playerOne", [250, 90, 73], 1);
		let playerTwo = new BaseEntity("playerTwo", [90, 250, 73], 2);
		playerOne.registerOponent(playerTwo);
		playerTwo.registerOponent(playerOne);
		return [playerOne, playerTwo];
	}
	
	private initControllers(players: BaseEntity[], keyBindings: KeyBindings[]) {
		let controllers: BaseController[] = [];
		for (let i = 0; i < players.length; i++) {
			const player = players[i];
			let controller = new BaseController(player, keyBindings[i]);
			controllers.push(controller);
		}
		return controllers;
	}
	
	private getBaseState(): GameCanvasState {
		let entities = this.initPlayers();
		let controllers = this.initControllers( entities, [new PlayerOneKeyBindings(), new PlayerTwoKeyBindings()]);
		let gameRunner = new GameRunner(entities, controllers, this.endCallback, this.drawCallback);
		return { entities, controllers, gameRunner };
	}

	componentDidMount() {
		document.addEventListener("keydown", this.onKeyPressed);
		document.addEventListener("keyup", this.onKeyReleased);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.onKeyPressed);
		document.removeEventListener("keyup", this.onKeyReleased);
	}

	public startGame = (): void => {
		this.setState({gameRunner: this.state.gameRunner.startGame()});
	}

	public resetGame = (): void => {
		let baseState = this.getBaseState();
		this.setState({
			entities : baseState.entities,
			controllers : baseState.controllers,
			gameRunner : baseState.gameRunner.startGame(),
		})
	}

	private drawCallback = (entityManager: EntityManagerInterface) => {
		const node = this.canvasRef.current;
		if ( node ) {
			let ctx = node.getContext("2d");
			if (ctx) {
				ctx.clearRect(0, 0, GameRender.BACKGROUND_WIDTH, GameRender.BACKGROUND_HEIGHT);
				// background
				ctx.fillStyle = getRGBString(GameRender.BACKGROUND_COLOR);
				ctx.fillRect(0, 0, GameRender.BACKGROUND_WIDTH, GameRender.BACKGROUND_HEIGHT);

				// platform
				ctx.fillStyle = getRGBString(GameRender.PLATFORM_COLOR);
				ctx.fillRect(
					GameLogic.PLATFORM_STARTING_X,
					GameLogic.PLATFORM_STARTING_Y,
					GameLogic.PLATFORM_WIDTH,
					GameLogic.PLATFORM_HEIGHT);
				
				entityManager.drawEntities(node);	
			}
		}
	}

	// TODO: figure out a less hacky way to re-render when it is game over.
	private endCallback = () => {
		this.setState(this.state);
	}

	onKeyPressed = (e: KeyboardEvent) => {
		this.state.gameRunner.onKeyPressed(e.keyCode);
    }

    onKeyReleased = (e: KeyboardEvent) => {
	   this.state.gameRunner.onKeyReleased(e.keyCode);
	}
	
	private renderGamePrompt = (): JSX.Element => {
		let gameState = this.state.gameRunner.getGameState();
		let gamePrompt;
		let callback: () => void;
		if ( gameState === GameState.OVER ) {
			gamePrompt = 'GAME OVER: CLICK ME TO START A NEW GAME';
			callback = () => this.resetGame();
		} else if (gameState === GameState.STANDBY) {
			gamePrompt = 'CLICK ME TO START THE GAME';
			callback = () => this.startGame();
		} else {
			gamePrompt = '';
			callback = () => {return};
		}
		return (
			<div className="game-prompt-container" onClick={callback}>
				<div className="game-prompt">{gamePrompt}</div>
			</div>
		);
	}

	private renderCanvas = (): JSX.Element => {
		return (
			<canvas className="action-canvas"
				ref={this.canvasRef}
				width={GameRender.BACKGROUND_WIDTH}
				height={GameRender.BACKGROUND_HEIGHT} />
		);
	}

	private isPausedOrRunning= (): boolean => {
		let gameState = this.state.gameRunner.getGameState();
		return gameState === GameState.RUNNING || gameState === GameState.PAUSED;
	}

    render() {
    	return (
			<div className="canvas-container"> 
				{ this.isPausedOrRunning() ? this.renderCanvas() : this.renderGamePrompt() }
			</div>
    	);
    }
}

export default GameCanvas;