const rules = require("./webpack.rules");
const plugins = require("./webpack.plugins");

rules.push({
  test: /\.css$/,
  use: [{ loader: "style-loader" }, { loader: "css-loader" }],
});

rules.push({
  test: /\.scss$/,
  use: [
    { loader: "style-loader" },
    { loader: "css-loader" },
    { loader: "sass-loader" },
  ],
});

rules.push({
  test: /\.woff2?$/,
  use: [
    {
      loader: "url-loader",
      options: {
        name: "./assets/[name].[ext]?[hash]",
        mimetype: "application/font-woff",
      },
    },
  ],
});

rules.push({
  test: /\.svg$/,
  use: [
    {
      loader: "svg-url-loader",
      options: {
        limit: 10000,
      },
    },
  ],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css"],
  },
};
