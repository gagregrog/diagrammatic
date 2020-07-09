import faker from 'faker';

import Tree from './datastructures/Tree';
import SimpleContent from '../components/SimpleContent';

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
  const root = new Tree('root');

  const addMore = (currDepth = 0) => (node) => {
    // base case
    if (currDepth === depth) return;

    createDescendants(node);
    node.children.forEach(addMore(currDepth + 1));
  };

  addMore()(root);

  return root;
};
