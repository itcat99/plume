const chalk = require("chalk");

/**
 * 输出手动安装的依赖
 *
 * @param {array} dependents
 * @param {array} devDependents
 * @param {string} projectPath
 */
module.exports = (dependents, devDependents, projectPath) => {
  process.stdout.write(chalk.blueBright("====> You must manually install dependencies <==== \n"));
  process.stdout.write(chalk.green(`step 1: cd ${projectPath}\n`));
  dependents.length &&
    process.stdout.write(chalk.greenBright(`step 2: yarn add ${dependents.join(" ")}\n`));
  devDependents.length &&
    process.stdout.write(chalk.green(`step 3: yarn add -D ${devDependents.join(" ")}\n`));
};
