const App = require("@plume/app");
const Lib = require("@plume/lib");

module.exports = config => {
  const { mode = "app" } = config;
  mode === "app" ? new App(config) : new Lib(config);
};
