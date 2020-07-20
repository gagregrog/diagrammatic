const Tree = require('./Tree');
const processFile = require('../csv');

class DecisionTree {
  async ingest(csvData) {
    const { leafKey, nodeKeys, rows } = await processFile(csvData);
    this._leafKey = leafKey;
    this._nodeKeys = nodeKeys;
    this._rows = rows;

    this.buildTreeRecursively();
  }

  buildTreeRecursively() {
    this.root = new Tree({
      data: {
        column: this._nodeKeys[0],
        option: null,
        name: this._nodeKeys[0],
      },
    });

    const recurse = (node, rows, colName) => {
      const colIdx = this._nodeKeys.indexOf(colName);
      const nextColName = this._nodeKeys[colIdx + 1];

      const groupOptions = this.getGroupOptions(colName, rows);

      node.append(...groupOptions);
      node.children.forEach((childNode) => {
        const optionName = childNode.data.option;
        const nextRows = rows.filter((row) => row[colName].includes(optionName));

        if (nextColName) {
          recurse(childNode, nextRows, nextColName);
        }

        // console.log(
        //   JSON.stringify(
        //     {
        //       colName,
        //       nextColName,
        //       optionName,
        //       nextRows,
        //     },
        //     null,
        //     2,
        //   ),
        // );
      });
    };

    recurse(this.root, this._rows, this.root.data.column);
  }

  // get unique options across the provided rows for the given group name
  getGroupOptions(group, rows) {
    const options = Object.keys(
      (rows || this._rows).reduce((acc, row) => {
        const newAcc = { ...acc };
        const rowOptions = Array.isArray(row[group]) ? row[group] : [row[group]];

        rowOptions.forEach((option) => {
          newAcc[option] = true;
        });

        return newAcc;
      }, {}),
    );

    return options.map((option) => ({
      data: { column: group, option, name: `${group}__${option}` },
    }));
  }
}

module.exports = DecisionTree;
