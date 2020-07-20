class Node {
  constructor(data) {
    this.Content = data.Content;
    this.data = data.data || null;
    this.name = data.name || (data.data && data.data.name) || data;
    this.id = `${this.name}-${Math.random()}`;
    this.children = [];
  }
}

module.exports = Node;
