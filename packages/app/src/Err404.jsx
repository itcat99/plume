import React, { PureComponent } from "react";
import { withRouter, Link } from "react-router-dom";

class Error404 extends PureComponent {
  render() {
    return (
      <div>
        <h1>Not Found 404.</h1>
        <Link to="/">go Home</Link>
      </div>
    );
  }
}

export default withRouter(Error404);
