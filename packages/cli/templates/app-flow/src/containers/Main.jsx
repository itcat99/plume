import React, { Component } from "react";
import { createContainer } from "@plume/flow";
import Button from "../components/Button";

class Main extends Component {
  render() {
    const { actions, state } = this.props;
    const { plus, minus, plusAsync, minusAsync } = actions;

    return (
      <div>
        <span>number is: {state}</span>
        <Button onClick={plus}> + </Button>
        <Button onClick={minus}> - </Button>
        <Button onClick={plusAsync}> + (delay 300ms) </Button>
        <Button onClick={minusAsync}> - (delay 300ms) </Button>
      </div>
    );
  }
}

export default createContainer(Main, {
  namespace: "compute",
});
