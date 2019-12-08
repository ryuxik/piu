import React, {Component} from 'react';
import { ControllerInterface } from './CommonInterfaces/Controller';
import { EntityInterface, EntityManagerInterface, RendererInterface } from './CommonInterfaces/Entity';
import { GameLogic, GameRender } from './Constants';
import { getRGBString } from './Utils/ColorUtil';
import { BaseEntityManger } from './BaseImplementations/BaseEntityManager';

type GameCanvasProps = {
	entities: (EntityInterface & RendererInterface)[],
	controllers: ControllerInterface[],
}

type GameCanvasState = {
	entityManager: EntityManagerInterface;
	isActive: boolean;
	numTicksActive: number;
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
		}
		this.ticker = setInterval(() => this.tick(), GameLogic.MS_PER_TICK);
	}

	componentDidMount() {
		document.addEventListener("keydown", this.keyPressed);
		document.addEventListener("keyup", this.keyReleased);
		this.draw();
		this.startGame();
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this.keyPressed);
		document.removeEventListener("keyup", this.keyReleased);
		clearInterval(this.ticker);
	}

	public startGame(): void {
		this.setState((state: GameCanvasState) => {
			return {
				entityManager: state.entityManager,
				isActive: true,
			} as GameCanvasState;	
		});
	}

	public tick(): void {
		this.setState((state: GameCanvasState, props: GameCanvasProps) => {
			if(state.isActive) {
				state.entityManager.updateEntityPositions();
				this.draw();
				props.entities.forEach((entity: (EntityInterface & RendererInterface)) => {
					if (!entity.isAlive) {
						return {
							isActive: false,
							entityManager: state.entityManager,
							numTicksActive: 0,
						};
					}
				});
				return {
					entityManager: state.entityManager,
					isActive: state.isActive,
					numTicksActive: state.numTicksActive + 1,
				};
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

    render() {
    	return (
			<div className="canvas-container"> 
			<canvas className="action-canvas"
				ref={this.canvasRef}
				width={GameRender.BACKGROUND_WIDTH}
				height={GameRender.BACKGROUND_HEIGHT} />
			</div>
    	);
    }
}

export default GameCanvas;