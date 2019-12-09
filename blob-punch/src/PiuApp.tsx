import React from 'react';
import './index.css';

import GameCanvas from './GameCanvas';
import Navbar from './Navbar';

const PiuApp : React.FC = () => {
    return (
      <div className="piu-app">
        <Navbar/>
        <GameCanvas/>
      </div>
    );
}

export default PiuApp;
