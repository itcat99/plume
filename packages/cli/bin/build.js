/* eslint no-console:0 */
const App = require("@plume/app");
const Lib = require("@plume/lib");

module.exports = (customConfig, mode) => {
  console.log("run this", mode);
  const instance = mode === "app" ? new App("@plume/app") : new Lib("@plume/lib");
  instance.build();
};
