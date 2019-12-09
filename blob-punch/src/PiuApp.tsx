import React, { Component } from 'react';
import './index.css';

import GameCanvas from './GameCanvas';
import Navbar from './Navbar';
import { BaseEntity } from './BaseImplementations/BaseEntity';
import { BaseController } from './BaseImplementations/BaseController'
import { PlayerOneKeyBindings, PlayerTwoKeyBindings } from './LocalPlay/LocalKeyBindings';
import { KeyBindings } from './CommonInterfaces/Controller';

type PiuAppProps = {

}
type PiuAppState = {
  entities: BaseEntity[],
  controllers: BaseController[],
}

class PiuApp extends Component<PiuAppProps, PiuAppState> {
  constructor(props: PiuAppProps) {
    super(props);
    this.state = this.baseState();
  }

  private initPlayers(): BaseEntity[] {
    let playerOne = new BaseEntity("playerOne", [34, 76, 23], 1);
    let playerTwo = new BaseEntity("playerTwo", [88, 45, 213], 2);
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

  private baseState(): PiuAppState {
    let entities = this.initPlayers();
    let controllers = this.initControllers(
      entities,
      [new PlayerOneKeyBindings(),
      new PlayerTwoKeyBindings()]);
    return { entities, controllers }
  }

  private resetGameCallback = (): Promise<void> => {
    console.log("resetting players in pueapp");
    this.setState(this.baseState());
    return Promise.resolve();
  }

  render() {
    return (
      <div className="piu-app">
        <Navbar/>
        <GameCanvas
        entities={this.state.entities}
        controllers={this.state.controllers}
        resetGameCallback={this.resetGameCallback}/>
      </div>
    );
  }
}

export default PiuApp;
