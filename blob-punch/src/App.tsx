import React from 'react';

import Game from './Game';

const App: React.FC = () => {
  return (
    <div className="App">
      <Game
        entities={[]}
        controllers={[]}/>
    </div>
  );
}

export default App;
