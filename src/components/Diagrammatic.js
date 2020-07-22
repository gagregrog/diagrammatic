import React from 'react';

import './diagrammatic.css';
import { useGraphController } from '../hooks/diagrammatic';

function Diagrammatic(props) {
  const {
    reset,
    current,
    history,
    handleBack,
    setGraphNodeById,
    setNextNodeByEvent,
    setTreeNodeByChildIdx,
  } = useGraphController(props);

  return (
    current && (
      <div className="diagrammatic-root">
        <h1 className="diagrammatic-title">{current.name}</h1>
        <div className="diagrammatic-back">
          {!!history.length && (
            <>
              <button onClick={reset}>Reset</button>
              <button onClick={handleBack}>Back</button>
            </>
          )}
        </div>
        <div className="diagrammatic-display">
          {!!current.children?.[0]?.data?.column && (
            <div className="diagrammatic-data">{current.children[0].data.column}</div>
          )}
          {current.children &&
            current.children.map(({ name, id, Content, data }, idx) => {
              const contentProps = {
                id,
                idx,
                name,
                data,
                key: id,
                isGraph: !!props.graph,
                isTree: !props.graph,
                handleClick: props.graph ? setGraphNodeById : setTreeNodeByChildIdx,
              };

              return Content ? (
                <Content {...contentProps} />
              ) : (
                <button key={id} name={props.graph ? id : idx} onClick={setNextNodeByEvent}>
                  {data?.option || name}
                </button>
              );
            })}
        </div>
      </div>
    )
  );
}

export default Diagrammatic;
