const path = require(`path`);

module.exports = {
  mode: `development`,
  entry: `./dist/renderer/index.js`,
  output: {
    path: path.resolve(__dirname, `dist`),
    filename: `index.js`,
  },
  resolve: {
    extensions: [`.ts`, `.js`],
  },
};
