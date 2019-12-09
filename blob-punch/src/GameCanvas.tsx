import React, { useRef } from 'react';
import { EntityManagerInterface } from './CommonInterfaces/Entity';
import { GameLogic, GameRender } from './Constants';
import { getRGBString } from './Utils/ColorUtil';
import { GameState } from './GameRunner';
import { LocalGameProvider } from './LocalPlay/LocalGameProvider';

type GameCanvasProps = {
	gameProvider: LocalGameProvider,
	gameState: GameState,

}

const GameCanvas: React.FC<GameCanvasProps> = (props: GameCanvasProps) => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const startGame = (): void => {
		props.gameProvider.startGame(drawCallback);
	}

	const resetGame = (): void => {
		props.gameProvider.resetGame(drawCallback);
	}

	const drawCallback = (entityManager: EntityManagerInterface) => {
		const node = canvasRef.current;
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

	const renderGamePrompt = (): JSX.Element => {
		let gamePrompt;
		let callback: () => void;
		if ( props.gameState === GameState.OVER ) {
			gamePrompt = 'GAME OVER: CLICK ME TO START A NEW GAME';
			callback = () => resetGame();
		} else if (props.gameState === GameState.STANDBY) {
			gamePrompt = 'CLICK ME TO START THE GAME';
			callback = () => startGame();
		} else {
			gamePrompt = 'OOPS YOU ENCOUNTERED A BUG';
			callback = () => {return};
		}
		return (
			<div className="game-prompt-container" onClick={callback}>
				<div className="game-prompt">{gamePrompt}</div>
			</div>
		);
	}

	const renderCanvas = (): JSX.Element => {
		return (
			<canvas className="action-canvas"
				ref={canvasRef}
				width={GameRender.BACKGROUND_WIDTH}
				height={GameRender.BACKGROUND_HEIGHT} />
		);
	}

	const isPausedOrRunning = (): boolean => {
		return props.gameState === GameState.RUNNING || props.gameState === GameState.PAUSED;
	}

	return (
		<div className="canvas-container"> 
			{ isPausedOrRunning() ? renderCanvas() : renderGamePrompt() }
		</div>
	);
}

export default GameCanvas;