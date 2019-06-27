/* eslint-disable react/display-name */
import React, { PureComponent } from "react";
import { HashRouter, BrowserRouter, Route, Switch, withRouter } from "react-router-dom";

import Loadable from "react-loadable";
import pagesInfo from "./_pagesInfo.json";

const getLoadableCmp = info => {
  const { path: url, component, author, layout, routers } = info;
  let loadableComponent;
  78;

  if (author || layout) {
    const loader = {
      Cmp: () => import(`{{relativePath}}${component}`),
    };
    if (author) loader.Author = () => import(`{{relativePath}}${author}`);
    if (layout) loader.Layout = () => import(`{{relativePath}}${layout}`);

    loadableComponent = Loadable.Map({
      loader,
      render(loaded, props) {
        const Author = loaded.Author ? loaded.Author.default : null;
        const Layout = loaded.Layout ? loaded.Layout.default : null;
        const Cmp = loaded.Cmp.default;
        const { history, location, match, staticContext } = props;
        const routeProps = { history, location, match, staticContext };
        let contentCmp = <Cmp {...props} />;

        if (Layout) {
          contentCmp = routers ? (
            <Layout {...props}>
              <Switch>
                {getRoutes(routers)}
                {getRoutes([{ path: url === "/" ? url : `${url}/`, component }])}
              </Switch>
            </Layout>
          ) : (
            <Layout {...props}>{contentCmp}</Layout>
          );
        }

        return Author ? <Author {...routeProps}>{contentCmp}</Author> : contentCmp;
      },
      loading: props => {
        // if (url === "/") return null;
        if (props.pastDelay) return <div>Loading...</div>;
        return null;
      },
      delay: 200,
    });
  } else {
    loadableComponent = Loadable({
      loader: () => import(`{{relativePath}}${component}`),
      loading: props => {
        // if (url === "/") return null;
        if (props.pastDelay) return <div>Loading...</div>;
        return null;
      },
      delay: 200,
    });
  }

  return loadableComponent;
};

const getRoutes = info =>
  info.map((route, index) => {
    const { path: url, exact } = route;
    const loadableComponent = getLoadableCmp(route);

    return (
      <Route
        exact={exact}
        path={url}
        key={`${url}_${index}`}
        component={withRouter(loadableComponent)}
      />
    );
  });

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

const Router = hashRouter =>
  hashRouter === "true" ? (
    <HashRouter>
      <SwitchRoute />
    </HashRouter>
  ) : (
    <BrowserRouter>
      <SwitchRoute />
    </BrowserRouter>
  );

export default Router;
