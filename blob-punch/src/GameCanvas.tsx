import React, {Component} from 'react';
import { ControllerInterface } from './CommonInterfaces/Controller';
import { EntityInterface } from './CommonInterfaces/Entity';
import { GameLogic, GameRender } from './Constants';
import { getRGBString } from './Utils/ColorUtil';

type GameCanvasProps = {
	entities?: EntityInterface[],
	controllers?: ControllerInterface[],
}
type GameCanvasState = {

}

class GameCanvas extends Component<GameCanvasProps, GameCanvasState> {
	private canvasRef : React.RefObject<HTMLCanvasElement> = React.createRef<HTMLCanvasElement>();

	componentDidMount() {
		this.draw();
	}

	private draw = () => {
		const ctx = this.canvasRef.current!.getContext("2d"); 
		if ( ctx ) {
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