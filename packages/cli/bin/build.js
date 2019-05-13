/* eslint no-console:0 */
const App = require("@plume/app");
const Lib = require("@plume/lib");

module.exports = config => {
  const { mode = "app" } = config;
  console.log("mode: ", mode);
  if (mode === "app") {
    const instance = new App(config);
    instance.build();
  } else {
    const instance = new Lib(config);
    instance.build();
    instance.buildDocz();
  }
  // const instance = mode === "app" ? new App(customConfig) : new Lib(customConfig);
  // instance.build();
};
