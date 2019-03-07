const inquirer = require("inquirer");

module.exports = (name, path, opts) => {
  inquirer
    .prompt([
      {
        type: "confirm",
        name: "flow",
        message: "do you want to use @plume/flow?",
      },
      {
        type: "list",
        name: "module",
        message: "choice a module you want to add.",
        choices: ["component", "container", "page", "model"],
      },
    ])
    .then(answers => {
      console.log("answers is: ", answers);
    });
};
