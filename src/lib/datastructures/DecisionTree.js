const Tree = require('./Tree');
const processFile = require('../csv');

class DecisionTree {
  async ingest(csvData, parseOpts) {
    const { leafKey, nodeKeys, rows } = await processFile(csvData, parseOpts);
    this._rows = rows;
    this._leafKey = leafKey;
    this._nodeKeys = nodeKeys;

    this.buildTreeRecursively();
  }

  static formatNodeData(column, option = null) {
    return {
      data: {
        column,
        option,
        name: `${column}__${option}`,
      },
    };
  }

  buildTreeRecursively() {
    this.root = new Tree(DecisionTree.formatNodeData(this._nodeKeys[0]));

    const recurse = (node, rows, colName) => {
      const colIdx = this._nodeKeys.indexOf(colName);
      const nextColName = this._nodeKeys[colIdx + 1];

      const groupOptions = DecisionTree.getGroupOptions(colName, rows);

      // if we don't have any choice, simply go to the next column
      if (groupOptions.length === 1) {
        if (nextColName) {
          return recurse(node, rows, nextColName);
        }

        // if no next column append the leaf nodes as the final choices
        node.append(
          ...rows.map((row) => DecisionTree.formatNodeData(this._leafKey, row[this._leafKey])),
        );
        node.sortChildrenByName();

        return;
      }

      node.append(...groupOptions);
      node.sortChildrenByName();
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

    recurse(this.root, this._rows, this.root.data.column);
  }

  // get unique options across the provided rows for the given group name
  static getGroupOptions(group, rows) {
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

    return options.map((option) => DecisionTree.formatNodeData(group, option));
  }
}

module.exports = DecisionTree;
