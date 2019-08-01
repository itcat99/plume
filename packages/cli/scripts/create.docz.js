const fse = require("fs-extra");
const path = require("path");

const getData = plugins => `export default {
  title: "My Lib",
  description: "This is my awesome documentation",${plugins ? "\n" + plugins : ""}
};`;

/**
 * 为lib mode设置docz配置文件
 */
module.exports = (projectPath, mode, modules) => {
  let data = getData();

  if (mode !== "styled-components") {
    const plugins = `plugins: [
      css({
        preprocessor:"${mode === "css" ? "postcss" : mode}",
        cssmodules:${modules},
      }),
    ]`;

    data = `import {css} from 'docz-plugin-css';\n\n${getData(plugins)}`;
  }

  fse.writeFileSync(path.join(projectPath, "doczrc.js"), data);
};
