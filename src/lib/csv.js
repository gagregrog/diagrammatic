const Papa = require('papaparse');

const parse = (csvData, parseOpts = {}) =>
  new Promise((resolve) => {
    Papa.parse(csvData, {
      complete: resolve,
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      ...parseOpts,
    });
  });

// split comma delimited strings into an array of options
// count the number of unique options per column
const splitOptions = (rows) => {
  const counts = {};

  const splitRows = rows.map((row) =>
    Object.entries(row).reduce((acc, [key, optionVal]) => {
      if (!counts[key]) {
        counts[key] = {};
      }

      const options = optionVal.split(',').map((part) => part.trim());

      options.forEach((option) => {
        counts[key][option] = true;
      });

      return { ...acc, [key]: options.length > 1 ? options : options[0] };
    }, {}),
  );

  const numberCounts = Object.entries(counts).reduce(
    (acc, [key, options]) => ({
      ...acc,
      [key]: Object.keys(options).length,
    }),
    {},
  );

  return { rows: splitRows, counts: numberCounts };
};

// sort the node keys based on the number of options for that key
const sortByCounts = (array, counts) => {
  array.sort((a, b) => {
    if (counts[a] > counts[b]) return -1;
    if (counts[a] < counts[b]) return 1;
    return 0;
  });
};

const processSpreadsheetFile = async (csvData, parseOpts) => {
  const results = await parse(csvData, parseOpts);
  const [leafKey, ...nodes] = results.meta.fields;
  const { rows, counts } = splitOptions(results.data);
  sortByCounts(nodes, counts);

  return {
    leafKey,
    nodeKeys: nodes,
    rows,
  };
};

module.exports = processSpreadsheetFile;
