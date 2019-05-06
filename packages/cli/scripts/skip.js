const chalk = require("chalk");

module.exports = (dependents, devDependents, projectPath) => {
  process.stdout.write(chalk.blueBright("====> You must manually install dependencies <==== \n"));
  process.stdout.write(chalk.green(`step 1: cd ${projectPath}\n`));
  process.stdout.write(chalk.greenBright(`step 2: yarn add ${dependents.join(" ")}\n`));
  process.stdout.write(chalk.green(`step 3: yarn add -D ${devDependents.join(" ")}\n`));
};
