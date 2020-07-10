import faker from 'faker';

import Tree from './datastructures/Tree';
import SimpleContent from '../components/SimpleContent';
import Graph from './datastructures/Graph';

const nums = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'];
const getSomeNums = () => nums.slice(0, Math.floor(Math.random() * (nums.length - 2)) + 2);
const getSomeWords = () => getSomeNums().map(() => faker.hacker.ingverb());

const getNodeContent = (parentNode) => (word) => {
  const name = `${parentNode.name}-${word}`; 
  const id = `${name}-${Math.random()}`;
  
  return { id, name, Content: SimpleContent };
};

const createDescendants = (parentNode) => {
  parentNode.append(...getSomeWords().map(getNodeContent(parentNode)));
}

export const createTreeRecursively = (depth = 1) => {
  const root = new Tree({
    name: 'Tree',
    Content: SimpleContent,
  });

  const addMore = (currDepth = 0) => (node) => {
    // base case
    if (currDepth === depth) return;

    createDescendants(node);
    node.children.forEach(addMore(currDepth + 1));
  };

  addMore()(root);

  return root;
};

const directed = true;
export const directedGraph = new Graph(directed);

const nodes = directedGraph.createNodes(
  { name: 'zeroth', Content: SimpleContent, },
  { name: 'first', Content: SimpleContent, },
  { name: 'second', Content: SimpleContent, },
  { name: 'third', Content: SimpleContent, },
  { name: 'fourth', Content: SimpleContent, },
  { name: 'fifth', Content: SimpleContent, },
  { name: 'sixth', Content: SimpleContent, },
  { name: 'seventh', Content: SimpleContent, },
  { name: 'eighth', Content: SimpleContent, },
);

directedGraph.linkNodes(nodes[0], nodes[6]);
directedGraph.linkNodes(nodes[1], ...nodes.slice(2, 5));
directedGraph.linkNodes(nodes[2], nodes[1], nodes[4]);
directedGraph.linkNodes(nodes[4], nodes[0], nodes[3], nodes[7], nodes[8]);
directedGraph.linkNodes(nodes[6], nodes[5]);
directedGraph.linkNodes(nodes[7], nodes[8]);
directedGraph.linkNodes(nodes[8], nodes[7]);
