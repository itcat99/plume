/*eslint no-undef: "error"*/
/*eslint-env browser*/

import { PureComponent } from "react";
import Routers from "./Router";

class App extends PureComponent {
  render() {
    return Routers("{{hashRouter}}");
  }

  componentDidMount() {
    setTimeout(() => {
      const $loader = document.getElementById("loader");
      $loader && $loader.remove();
    }, 200);
  }
}

export default App;
