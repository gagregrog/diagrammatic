import React, { useState, useCallback, useEffect, useRef } from 'react';

import './diagramatique.css';

function Diagramatique(props) {
  const dataRef = useRef(props.tree || props.data);
  const [history, setHistory] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if ((props.tree || props.graph) !== dataRef.current) {
      dataRef.current = (props.graph || props.tree);
      setCurrent(null);
      setHistory([]);
    }
  }, [props.graph, props.tree]);

  useEffect(() => {
    if (!current && props.tree) {
      setCurrent(props.tree);
    } else if (!current && props.graph) {
      setCurrent(props.graph.spawnStarterNode());
    }
  }, [props, current]);

  // move up one level
  const handleBackTree = useCallback(() => {
    // find the new current by running over "tree" using the history child indices
    setCurrent(history.slice(0, -1).reduce((acc, idx) => acc.children[idx], props.tree));

    // pop off the last item in the history
    setHistory(state => state.slice(0, -1));
  }, [history, props.tree]);

  const handleClickTree = useCallback((idx) => {
    setHistory(hist => [...hist, idx ]);
    setCurrent(curr => curr.children[idx]);
  }, []);

  const handleClickButtonTree = useCallback((e) => {
    const idx = +e.target.name;

    handleClickTree(idx);
  }, [handleClickTree]);

  // move up one level
  const handleBackGraph = useCallback(() => {
    const lastId = history[history.length - 2];

    setCurrent(lastId
      ? props.graph.getNode(lastId)
      : props.graph.spawnStarterNode()
    );

    // pop off the last item in the history
    setHistory(state => state.slice(0, -1));
  }, [history, props.graph]);

  const handleClickGraph = useCallback((id) => {
    setHistory(hist => [...hist, id]);
    setCurrent(props.graph.getNode(id));
  }, [props.graph]);

  const handleClickButtonGraph = useCallback((e) => {
    const id = e.target.name;

    handleClickGraph(id);
  }, [handleClickGraph]);

  return (current &&
    <div className="diagramatique-root">
      <h1 className="diagramatique-title">{current.name}</h1>
      <div className="diagramatique-back">
        {!!history.length && <button onClick={props.tree ? handleBackTree : handleBackGraph}>Back</button>}
      </div>
      <div className="diagramatique-display">
        {current.children && current.children
          .map(({ name, id, Content }, idx) => {
            const contentProps = {
              id,
              name,
              key: id,
              handleClick: props.tree ? handleClickTree : handleClickGraph,
            };

            if (props.tree) {
              contentProps.idx = idx;
            }

            return (Content
              ? <Content {...contentProps} />
              : (
                <button key={id} name={props.tree ? idx : id} onClick={props.tree ? handleClickButtonTree : handleClickButtonGraph}>
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
