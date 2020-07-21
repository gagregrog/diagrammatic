import { useRef, useState, useEffect, useCallback, useMemo } from 'react';

export const useGraphController = (props) => {
  const dataRef = useRef(props.tree || props.data);

  // history holds a list of:
  //  - indices for Trees
  //  - ids for Graphs
  const [history, setHistory] = useState([]);
  // holds the current node of either graph or tree
  const [current, setCurrent] = useState(null);

  const reset = useCallback(() => {
    setCurrent(null);
    setHistory([]);
  }, []);

  useEffect(() => {
    // if the data has changed, reset the state
    if ((props.tree || props.graph) !== dataRef.current) {
      dataRef.current = props.graph || props.tree;
      reset();
    }
  }, [props.graph, props.tree, reset]);

  useEffect(() => {
    // if no current is set and we have data, set the root node
    if (!current && props.tree) {
      setCurrent(props.tree);
    } else if (!current && props.graph) {
      setCurrent(props.graph.spawnStarterNode());
    }
  }, [props, current]);

  const handleBackTree = useCallback(() => {
    // find the new current by running over "tree" using the history child indices
    setCurrent(history.slice(0, -1).reduce((acc, idx) => acc.children[idx], props.tree));

    // pop off the last item in the history
    setHistory((state) => state.slice(0, -1));
  }, [history, props.tree]);

  const handleBackGraph = useCallback(() => {
    const lastId = history[history.length - 2];

    setCurrent(lastId ? props.graph.getNode(lastId) : props.graph.spawnStarterNode());

    // pop off the last item in the history
    setHistory((state) => state.slice(0, -1));
  }, [history, props.graph]);

  const handleBack = useCallback(() => (props.graph ? handleBackGraph() : handleBackTree()), [
    props.graph,
    handleBackGraph,
    handleBackTree,
  ]);

  const setTreeNodeByChildIdx = useCallback((idx) => {
    setHistory((hist) => [...hist, idx]);
    setCurrent((curr) => curr.children[idx]);
  }, []);

  const setGraphNodeById = useCallback(
    (id) => {
      if (!props.graph) {
        throw new Error('Cannot call setNextNodeById without graph');
      }

      setHistory((hist) => [...hist, id]);
      setCurrent(props.graph.getNode(id));
    },
    [props.graph],
  );

  const setNextNodeByEventNameIdx = useCallback(
    (e) => {
      const idx = +e.target.name;

      setTreeNodeByChildIdx(idx);
    },
    [setTreeNodeByChildIdx],
  );

  const setNextNodeByEventNameId = useCallback(
    (e) => {
      const id = e.target.name;

      setGraphNodeById(id);
    },
    [setGraphNodeById],
  );

  const setNextNodeByEvent = useCallback(
    (e) => (props.graph ? setNextNodeByEventNameId(e) : setNextNodeByEventNameIdx(e)),
    [props.graph, setNextNodeByEventNameId, setNextNodeByEventNameIdx],
  );

  const controller = useMemo(
    () => ({
      reset,
      current,
      history,
      handleBack,
      setGraphNodeById,
      setNextNodeByEvent,
      setTreeNodeByChildIdx,
    }),
    [
      reset,
      current,
      history,
      handleBack,
      setGraphNodeById,
      setNextNodeByEvent,
      setTreeNodeByChildIdx,
    ],
  );

  return controller;
};
