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
}

export default Tree;
