const Node = require('./Node');

class Tree extends Node {
  append(...data) {
    const nodes = data.map((data) => new Tree(data));

    this.children.push(...nodes);

    return this;
  }

  sortChildrenByName(reverse) {
    let mult = reverse ? -1 : 1;
    this.children.sort((a, b) => a.name.localeCompare(b.name) * mult);
  }
}

module.exports = Tree;
