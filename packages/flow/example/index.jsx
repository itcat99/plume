// import React from "react";
import Flow from "../lib";
// import model from "./model";
// import App from "./App";

// const Main = () => <div>Hello</div>;

// const app = new Flow({
//   target: "root",
//   app: <App />,
//   models: [model],
// });

// const app = new Flow();
// app.run();

import React from "react";
// import Flow from "@plume/flow";

const Main = () => <div>Main module.</div>;
const app = new Flow({
  app: <Main />,
});

app.run();
