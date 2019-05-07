/* eslint no-console:0 */
const App = require("@plume/app");
const Lib = require("@plume/lib");

module.exports = (customConfig, mode) => {
  if (mode === "app") {
    const instance = new App(customConfig);
    instance.build();
  } else {
    const instance = new Lib(customConfig);
    instance.build();
    instance.buildDocz();
  }
  // const instance = mode === "app" ? new App(customConfig) : new Lib(customConfig);
  // instance.build();
};
