import React, { useState, useCallback } from 'react';

import './diagramatique.css';

function Diagramatique(props) {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(props.tree);

  // move up one level
  const handleBack = useCallback(() => {
    // find the new current by running over "data" using the history child indices
    setCurrent(history.slice(0, -1).reduce((acc, child) => acc.children[child.idx], props.data));

    // pop off the last item in the history
    setHistory(state => state.slice(0, -1));
  }, [history, props.data]);

  const handleClick = useCallback((name, idx) => {
    setHistory(hist => [...hist, { name, idx }]);
    setCurrent(curr => curr.children[idx]);
  }, []);

  const handleClickButton = useCallback((e) => {
    const identifier = e.target.name;
    const [name, idx] = identifier.split('___');

    handleClick(name, idx);
  }, [handleClick]);

  return (
    <div>
      <h1>{current.name}</h1>
      <div className="diagramatique-back">
        {!!history.length && <button onClick={handleBack}>Back</button>}
      </div>
      <div className="diagramatique-display">
        {current.children && current.children
          .map(({ name, id, Content }, idx) => {

            return (Content
              ? <Content key={id} handleClick={handleClick} idx={idx} name={name} />
              : (
                <button key={id} name={`${name}___${idx}`} onClick={handleClickButton}>
                  {name}
                </button>
              )
            );
          })
        }
      </div>
    </div>
  );
}

export default Diagramatique;
