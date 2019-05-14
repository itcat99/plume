/* eslint no-console:0 */
const App = require("@plume/app");
const Lib = require("@plume/lib");

module.exports = config => {
  const { mode = "app" } = config;

  if (mode === "app") {
    const instance = new App(config);
    instance.build();
  } else {
    const instance = new Lib(config);
    instance.build();
  }
};
