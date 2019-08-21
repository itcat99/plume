/* eslint-disable react/display-name */
import React, { PureComponent } from "react";
import { HashRouter, BrowserRouter, Route, Switch, withRouter } from "react-router-dom";

import Loadable from "react-loadable";
import pagesInfo from "./pagesInfo.json";

const delay = 200;
const loading = props => {
  const { error } = props;
  if (error) {
    throw new Error(error);
  }

  if (props.pastDelay) return <div>Loading...</div>;
  return null;
};

const getLoadableCmp = info => {
  const { path: url, component, author, layout, children } = info;
  let loadableComponent;

  const loader = {};
  if (component) loader.Cmp = () => import(`{{relativePath}}${component}`);
  if (author) loader.Author = () => import(`{{relativePath}}${author}`);
  if (layout) loader.Layout = () => import(`{{relativePath}}${layout}`);

  loadableComponent = Loadable.Map({
    loader,
    render(loaded, props) {
      const Author = loaded.Author ? loaded.Author.default : null;
      const Layout = loaded.Layout ? loaded.Layout.default : null;
      const Cmp = loaded.Cmp ? loaded.Cmp.default : null;
      const { history, location, match, staticContext } = props;
      const routeProps = { history, location, match, staticContext };
      let resultCmp = null;

      if (Cmp) resultCmp = <Cmp {...props} />;
      if (children)
        resultCmp = (
          <Switch>
            {getRoutes(children)}
            {getRoutes([{ path: url === "/" ? url : `${url}/`, component }])}
          </Switch>
        );
      if (Layout) resultCmp = <Layout {...props}>{resultCmp}</Layout>;
      if (Author) resultCmp = <Author {...routeProps}>{resultCmp}</Author>;

      return resultCmp;
    },
    loading,
    delay,
  });

  return loadableComponent;
};

const getRoutes = info => {
  return info.map((route, index) => {
    const { path: url } = route;
    const loadableComponent = getLoadableCmp(route);

    return <Route path={url} key={`${url}_${index}`} component={withRouter(loadableComponent)} />;
  });
};

class SwitchRoute extends PureComponent {
  render() {
    return (
      <Switch>
        {getRoutes(pagesInfo)}
        <Route
          component={Loadable({
            loader: () => import(`{{errorPages}}/404`),
            loading: () => <div>Loading...</div>,
            delay: 300,
          })}
        />
      </Switch>
    );
  }
}

const Router = (hashRouter, basename) =>
  hashRouter === "true" ? (
    <HashRouter basename={basename || ""}>
      <SwitchRoute />
    </HashRouter>
  ) : (
    <BrowserRouter basename={basename || ""}>
      <SwitchRoute />
    </BrowserRouter>
  );

export default Router;
