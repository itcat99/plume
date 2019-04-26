/* eslint no-console:0 */
// const App = require("@plume/app");
// const Lib = require("@plume/lib");

module.exports = (customConfig, mode) => {
  const constructor = mode === "app" ? require("@plume/app") : require("@plume/lib");
  const instance = new constructor(customConfig);
  instance.dev();
};
