let path = require("path");

if (process.platform === "win32") path = path.win32;

module.exports = path;
