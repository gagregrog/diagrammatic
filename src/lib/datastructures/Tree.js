const Node = require('./Node');
const processFile = require('../csv');

const formatCSVDataForNode = (column, option, Content) => ({
  data: {
    column,
    option,
    name: `${column}__${option}`,
  },
  Content,
});

// get unique options across the provided rows for the given group name
const getGroupOptions = (group, rows, Content) => {
  const options = Object.keys(
    rows.reduce((acc, row) => {
      const newAcc = { ...acc };
      const rowOptions = Array.isArray(row[group]) ? row[group] : [row[group]];

      rowOptions.forEach((option) => {
        newAcc[option] = true;
      });

      return newAcc;
    }, {}),
  );

  return options.map((option) => formatCSVDataForNode(group, option, Content));
};

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

  __buildTreeRecursively(leafKey, nodeKeys, rows, Content, reverseSort) {
    const recurse = (node, rows, colName) => {
      const colIdx = nodeKeys.indexOf(colName);
      const nextColName = nodeKeys[colIdx + 1];

      const groupOptions = getGroupOptions(colName, rows, Content);

      // if we don't have any choice, simply go to the next column
      if (groupOptions.length === 1) {
        if (nextColName) {
          return recurse(node, rows, nextColName);
        }

        // if no next column append the leaf nodes as the final choices
        node.append(...rows.map((row) => formatCSVDataForNode(leafKey, row[leafKey], Content)));
        node.sortChildrenByName(reverseSort);

        return;
      }

      node.append(...groupOptions);
      node.sortChildrenByName(reverseSort);
      node.children.forEach((childNode) => {
        const optionName = childNode.data.option;
        const nextRows = rows.filter((row) => row[colName].includes(optionName));

        if (nextColName) {
          recurse(childNode, nextRows, nextColName);
        } else {
          console.log('An unaccounted for situation occurred! Things may or may not have broken');
        }
      });
    };

    recurse(this, rows, this.data.column);
  }

  static async fromCSV(rawCsvData, { parseOpts, Content, reverseSort } = {}) {
    const { leafKey, nodeKeys, rows } = await processFile(rawCsvData, parseOpts);

    const tree = new Tree(formatCSVDataForNode(nodeKeys[0], null, Content));
    tree.__buildTreeRecursively(leafKey, nodeKeys, rows, Content, reverseSort);

    return tree;
  }
}

module.exports = Tree;
