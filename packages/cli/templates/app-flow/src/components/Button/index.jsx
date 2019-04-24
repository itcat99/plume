import React, { PureComponent } from "react";

class Button extends PureComponent {
  render() {
    const { onClick, children } = this.props;

    return <button onClick={onClick}>{children}</button>;
  }
}

export default Button;
