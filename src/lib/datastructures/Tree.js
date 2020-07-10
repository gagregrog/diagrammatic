class Tree {
  constructor(data) {
    this.Content = data.Content;
    this.name = data.name || data.toString();
    this.id = `${this.name}-${Math.random()}`;
    this.children = [];
  }

  append(...data) {
    const nodes = data.map(data => new Tree(data));

    this.children.push(...nodes);

    return this;
  }

  getChildren(...nodeIds) {
    return this.children.filter(child => nodeIds.includes(child.id));
  }

  getChild(nodeId) {
    return this.getChildren(nodeId)[0];
  }

  getChildByIdx(idx) {
    return this.children[idx];
  }
}

export default Tree;
