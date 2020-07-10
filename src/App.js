import './App.css';
import React, { useState } from 'react';
import Diagramatique from './components/Diagramatique';
import { createTreeRecursively, directedGraph as graph } from './lib/util';


const tree = createTreeRecursively(6);

function App() {
  const [isTree, setIsTree] = useState(true);

  const props = isTree ? { tree } : { graph };

  const toggle = () => setIsTree(state => !state);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={toggle} className="toggle">Switch to {isTree ? 'Graph' : 'Tree'}</button>
        <Diagramatique {...props} />
      </header>
    </div>
  );
}

export default App;
