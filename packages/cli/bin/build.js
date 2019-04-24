/* eslint no-console:0 */
const app = require("@plume/app");
const lib = require("@plume/lib");

module.exports = (customConfig, mode) => {
  const instance = mode === "app" ? app(customConfig) : lib(customConfig);

  instance
    .build(customConfig)
    .then(() => {})
    .catch(err => console.error("err: ", err));
};
