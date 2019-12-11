import React, { Component } from 'react';
import './index.css';

import GameCanvas from './GameCanvas';
import Navbar from './Navbar';
import { LocalGameProvider } from './LocalPlay/LocalGameProvider';
import { GameState } from './GameRunner';
import { ProviderInterface } from './CommonInterfaces/Provider';

type PiuAppProps = {

}

type PiuAppState = {
  gameProvider: ProviderInterface,
  gameState: GameState,
}
class PiuApp extends Component<PiuAppProps, PiuAppState> {
  constructor(props: PiuAppProps) {
    super(props);
    let gameProvider = new LocalGameProvider(this.gameStateChangedCallback);
    this.state = {
      gameProvider,
      gameState: gameProvider.getGameState(),
    }
  }

  // used to propagate changes in state to rendering logic
  private gameStateChangedCallback = (gameState: GameState): void => {
    this.setState({gameState});
  }

  render() {
    return (
      <div className="piu-app">
        <Navbar/>
        <GameCanvas
          gameProvider={this.state.gameProvider}
          gameState={this.state.gameState}/>
      </div>
    );
  } 
}

export default PiuApp;
