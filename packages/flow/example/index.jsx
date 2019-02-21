import React from "react";
import Flow from "../lib";
import model from "./model";
import App from "./App";

const Main = () => <div>Hello</div>;

const app = new Flow({
  target: "root",
  app: <App />,
  models: [model],
});

app.run();
