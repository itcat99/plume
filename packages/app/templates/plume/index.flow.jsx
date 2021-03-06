import "core-js/stable";
import "regenerator-runtime/runtime";

import React from "react";
import Flow from "@plume/flow";
import models from "./models";
import App from "{{app}}";

const app = new Flow({
  target: "{{target}}",
  entry: <App />,
  models,
});

app.run();
