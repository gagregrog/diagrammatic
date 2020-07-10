import React, { useState, useCallback } from 'react';

import './diagramatique.css';

function Diagramatique(props) {
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(props.tree);

  // move up one level
  const handleBackTree = useCallback(() => {
    // find the new current by running over "tree" using the history child indices
    setCurrent(history.slice(0, -1).reduce((acc, { idx }) => acc.children[idx], props.tree));

    // pop off the last item in the history
    setHistory(state => state.slice(0, -1));
  }, [history, props.tree]);

  const handleClickTree = useCallback(({ id, idx }) => {
    setHistory(hist => [...hist, { id, idx }]);
    setCurrent(curr => curr.children[idx]);
  }, []);

  const handleClickButtonTree = useCallback((e) => {
    const idx = +e.target.name;

    handleClickTree({ idx });
  }, [handleClickTree]);

  return (
    <div>
      <h1>{current.name}</h1>
      <div className="diagramatique-back">
        {!!history.length && <button onClick={handleBackTree}>Back</button>}
      </div>
      <div className="diagramatique-display">
        {current.children && current.children
          .map(({ name, id, Content }, idx) => {
            const contentProps = { name, key: id, handleClick: props.tree ? handleClickTree : handleClickTree };

            if (props.tree) {
              contentProps.idx = idx;
            }

            return (Content
              ? <Content {...contentProps} />
              : (
                <button key={id} name={idx} onClick={props.tree ? handleClickButtonTree : handleClickButtonTree}>
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
