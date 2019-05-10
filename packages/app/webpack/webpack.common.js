const entry = require("./config.entry");
const output = require("./config.output");

module.exports = (config, isDev) => {
  return {
    entry: entry(config),
    output: output(config, isDev),
    module: {
      rules: [
        {
          test: /\.(js|jsx)?$/,
          loader: "babel-loader?cacheDirectory",
          exclude: /node_modules/,
        },
        {
          test: /\.scss?$/,
          use: ["style-loader", "css-loader", "sass-loader"],
        },
        {
          test: /\.less?$/,
          use: [
            "style-loader",
            "css-loader",
            {
              loader: "less-loader",
              options: {
                javascriptEnabled: true, // fixe antd compile bug
              },
            },
          ],
        },
        {
          test: /\.css?$/,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.hbs$/,
          use: ["handlebars-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".js", ".jsx", ".json", ".scss", ".css", ".less"],
      modules: ["node_modules"],
    },
  };
};
