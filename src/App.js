import './App.css';
import React, { useState, useCallback } from 'react';
import Diagrammatic from './components/Diagrammatic';
import { createTreeRecursively, directedGraph as graph, loadSampleDecisionTree } from './lib/util';

const tree = createTreeRecursively(6);
loadSampleDecisionTree().then((dtree) => {
  console.log(dtree);
  dataStructures.push({
    tree: dtree,
    name: 'CSV Tree',
  });
});

const dataStructures = [
  {
    tree: tree,
    name: 'Tree',
  },
  {
    graph,
    name: 'Graph',
  },
];

console.log(tree);
console.log(graph);

function App() {
  const [data, setData] = useState({ idx: 0, data: dataStructures[0] });

  const switchDataStructure = useCallback(() => {
    let nextIdx = data.idx + 1;
    if (nextIdx >= dataStructures.length) nextIdx = 0;

    const nextData = dataStructures[nextIdx];

    setData({ idx: nextIdx, data: nextData });
  }, [data]);

  return (
    <div className="App">
      <header className="App-header">
        <div className="ds-container">
          <div className="ds">
            Current: <span className="ds-current">{data.data.name}</span>
          </div>
          <button onClick={switchDataStructure} className="toggle">
            Switch Data Structures
          </button>
        </div>
        <Diagrammatic {...data.data} />
      </header>
    </div>
  );
}

export default App;
