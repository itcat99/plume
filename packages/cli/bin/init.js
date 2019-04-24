const App = require("@plume/app");
const Lib = require("@plume/lib");

module.exports = (customConfig, mode) => {
  mode === "app" ? new App(customConfig) : new Lib(customConfig);
};
