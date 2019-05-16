/* eslint no-console:0 */
const webpack = require("webpack");

module.exports = config => {
  const webpackCfg = require("./config")(config);
  const compiler = webpack(webpackCfg);

  compiler.run((err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
    }

    const info = stats.toJson({
      stats: "errors-only",
    });

    if (stats.hasErrors()) {
      console.error(info.errors);
    }

    console.log("SUCCESSED!");
  });
};
