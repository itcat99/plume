/* eslint-disable react/display-name */
import React, { PureComponent } from "react";
import { HashRouter, BrowserRouter, Route, Switch, withRouter } from "react-router-dom";

import Loadable from "react-loadable";
import pagesInfo from "./_pagesInfo.json";

const getLoadableCmp = info => {
  const { path: url, component, author, layout, children } = info;
  let loadableComponent;

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
          contentCmp = children ? (
            <Layout {...props}>
              <Switch>
                {getRoutes(children)}
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

const getRoutes = info => {
  console.log("INFO: ", info);
  return info.map((route, index) => {
    const { path: url } = route;
    const loadableComponent = getLoadableCmp(route);

    return <Route path={url} key={`${url}_${index}`} component={withRouter(loadableComponent)} />;
  });
};

const handlePagesInfo = infos => {
  const keys = Object.keys(infos);
  let result = [];

  for (const key of keys) {
    const info = infos[key];
    const { children } = info;
    const targetPages = key === "none" ? info : children;
    if (targetPages && targetPages.length > 0) result = [].concat(result, getRoutes(targetPages));
  }

  return result;
};

class SwitchRoute extends PureComponent {
  render() {
    return (
      <Switch>
        {handlePagesInfo(pagesInfo)}
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
