import './App.css';
import React from 'react';
import Diagramatique from './components/Diagramatique';
import { createTreeRecursively } from './lib/util';

const tree = createTreeRecursively(6);
console.log(tree);

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Diagramatique tree={tree} />
      </header>
    </div>
  );
}

export default App;
