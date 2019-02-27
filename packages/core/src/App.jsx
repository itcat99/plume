import React, { PureComponent } from "react";
import Routers from "./Router";

class App extends PureComponent {
  render() {
    return <Routers />;
  }

  componentDidMount() {
    setTimeout(() => {
      const $loader = document.getElementById("loader");
      $loader && $loader.remove();
    }, 200);
  }
}

export default App;
