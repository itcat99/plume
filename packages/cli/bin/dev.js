/* eslint no-console:0 */
const App = require("@plume/app");
const Lib = require("@plume/lib");

module.exports = (customConfig, mode) => {
  const instance = mode === "app" ? new App(customConfig) : new Lib(customConfig);
  instance.dev();
};
