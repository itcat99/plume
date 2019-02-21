import React from "react";
import { CreateContainer } from "../lib";

class App extends React.Component {
  render() {
    console.log("> App props: ", this.props);
    const { actions, state } = this.props;
    const { plus, minus, asyncPlus, asyncMinus } = actions;

    return (
      <div>
        <div>{state.count}</div>
        <button onClick={() => plus()}>plus</button>
        <button onClick={() => minus()}>minus</button>
        <button onClick={() => asyncPlus()}>asyncPlus</button>
        <button onClick={() => asyncMinus()}>asyncMinus</button>
      </div>
    );
  }
}
export default CreateContainer(App, {
  namespace: "compute",
});
