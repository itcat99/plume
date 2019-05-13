/* eslint no-console:0 */
const App = require("@plume/app");
const Lib = require("@plume/lib");

module.exports = config => {
  const { mode = "app" } = config;

  const instance = mode === "app" ? new App(config) : new Lib(config);
  instance.dev();
};
