import React, {Component} from 'react';
import { ControllerInterface } from './Controller';

type GameProps = {
	entities: any,
	controllers: ControllerInterface[],
}
type GameState = {

}

export class Game extends Component<GameProps, GameState> {
	canvasRef : React.RefObject<HTMLCanvasElement>= React.createRef<HTMLCanvasElement>();

	componentDidMount() {
		this.draw();
	}

	private draw = () => {
		const ctx = this.canvasRef.current!.getContext("2d"); 
        ctx!.fillStyle = "green";
        ctx!.beginPath();
        ctx!.arc(50, 100,                        
                20, 0, 2 * Math.PI);
        ctx!.fill();
        ctx!.stroke();
	}

    render() {
    	return (
	    <div> 
	      <canvas ref={this.canvasRef} width={450} height={650} />
	   	</div>
    	);
    }
}

export default Game;
