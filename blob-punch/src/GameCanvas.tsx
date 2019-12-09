import React, {Component} from 'react';
import { ControllerInterface } from './CommonInterfaces/Controller';
import { EntityInterface, EntityManagerInterface, RendererInterface } from './CommonInterfaces/Entity';
import { GameLogic, GameRender } from './Constants';
import { getRGBString } from './Utils/ColorUtil';
import { BaseEntityManger } from './BaseImplementations/BaseEntityManager';

type GameCanvasProps = {
	entities: (EntityInterface & RendererInterface)[],
	controllers: ControllerInterface[],
	resetGameCallback: () => Promise<void>;
}

type GameCanvasState = {
	entityManager: EntityManagerInterface;
	isActive: boolean;
	numTicksActive: number;
	isGameOver: boolean;
}

class GameCanvas extends Component<GameCanvasProps, GameCanvasState> {
	private canvasRef : React.RefObject<HTMLCanvasElement> = React.createRef<HTMLCanvasElement>();
	private ticker: NodeJS.Timeout;
	constructor(props: GameCanvasProps) {
		super(props);
		let entityManager = new BaseEntityManger();
		props.entities.forEach((entity: (EntityInterface & RendererInterface)) => {
			entityManager.addEntity(entity);
		});
		this.state = {
			entityManager,
			isActive: false,
			numTicksActive: 0,
			isGameOver: false,
		};
		this.ticker = setInterval(() => this.tick(), GameLogic.MS_PER_TICK);
	}

	componentDidMount() {
		document.addEventListener("keydown", this.keyPressed);
		document.addEventListener("keyup", this.keyReleased);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.keyPressed);
		document.removeEventListener("keyup", this.keyReleased);
		clearInterval(this.ticker);
	}

	public resetGame = async (): Promise<void> => {
		// TODO fix this bug
		await this.props.resetGameCallback();
		this.startGame();
	}

	public startGame = (): void  => {
		this.setState((state: GameCanvasState) => {
			this.draw();
			return {
				entityManager: state.entityManager,
				isActive: true,
				isGameOver: false,
				numTicksActive: 0,
			} as GameCanvasState;	
		});
	}

	public tick(): void {
		this.setState((state: GameCanvasState, props: GameCanvasProps) => {
			if (state.isActive && !state.isGameOver) {
				state.entityManager.updateEntityPositions();
				this.draw();
				for (let i = 0; i < props.entities.length; i++) {
					const entity = props.entities[i];
					if (!entity.isAlive) {
						return {
							isActive: false,
							isGameOver: true,
							numTicksActive: 0,
						} as GameCanvasState;
					}
				}
				return {
					numTicksActive: state.numTicksActive + 1,
				} as GameCanvasState;
			} else {
				return state;
			}
		});
	}

	private draw = () => {
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
				
				this.state.entityManager.drawEntities(node);	
			}
		}
	}

	keyPressed = (e: KeyboardEvent) => {
		if(this.state.isActive) {
			let keyCode = e.keyCode;
			this.props.controllers.forEach((controller: ControllerInterface) => {
				controller.keyPressed(keyCode);
			});
		}
    }

    keyReleased = (e: KeyboardEvent) => {
        if (this.state.isActive) {
			let keyCode = e.keyCode;
			this.props.controllers.forEach((controller: ControllerInterface) => {
				controller.keyReleased(keyCode);
			});
		}
	}
	
	private renderGamePrompt = (): JSX.Element => {
		let gamePrompt;
		let callback: () => void;
		if ( this.state.isGameOver ) {
			gamePrompt = 'GAME OVER: CLICK ME TO START A NEW GAME';
			callback = () => this.resetGame();
		} else {
			gamePrompt = 'CLICK ME TO START THE GAME';
			callback = () => this.startGame();
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

    render() {
    	return (
			<div className="canvas-container"> 
				{this.state.isActive ? this.renderCanvas() : this.renderGamePrompt()}
			</div>
    	);
    }
}

export default GameCanvas;