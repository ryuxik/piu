import React, { Component } from 'react';
import './index.css';

import GameCanvas from './GameCanvas';
import Navbar from './Navbar';
import { BaseEntity } from './BaseImplementations/BaseEntity';
import { BaseController } from './BaseImplementations/BaseController'
import { PlayerOneKeyBindings, PlayerTwoKeyBindings } from './LocalPlay/LocalKeyBindings';

type PiuAppProps = {

}
type PiuAppState = {
  entities: BaseEntity[],
  controllers: BaseController[],
}

class PiuApp extends Component<PiuAppProps, PiuAppState> {
  constructor(props: PiuAppProps) {
    super(props);
    let playerOne = new BaseEntity("playerOne", [34, 76, 23], 1);
    let controllerOne = new BaseController(playerOne, new PlayerOneKeyBindings());
    let playerTwo = new BaseEntity("playerTwo", [88, 45, 213], 2);
    let controllerTwo = new BaseController(playerTwo, new PlayerTwoKeyBindings());

    playerOne.registerOponent(playerTwo);
    playerTwo.registerOponent(playerOne);
    
    this.state = {
      entities: [playerOne, playerTwo],
      controllers: [controllerOne, controllerTwo],
    };
  }
  render() {
    return (
      <div className="piu-app">
        <Navbar/>
        <GameCanvas
        entities={this.state.entities}
        controllers={this.state.controllers}/>
      </div>
    );
  }
}

export default PiuApp;
