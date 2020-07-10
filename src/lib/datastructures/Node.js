export default class Node {
  constructor(data) {
    this.Content = data.Content;
    this.name = data.name || data.toString();
    this.id = `${this.name}-${Math.random()}`;
    this.children = [];
  }
}
