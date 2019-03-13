import React from "react";
import { HashRouter, Route, Switch } from "react-router-dom";

import Loadable from "react-loadable";
import pagesInfo from "./pagesInfo.json";

const Router = () => {
  return (
    <HashRouter>
      <Switch>
        {pagesInfo.map((route, index) => {
          const { exact, path: url, component } = route;
          return (
            <Route
              exact={exact}
              path={url}
              key={`${url}_${index}`}
              component={Loadable({
                loader: () => import(`{{relativePath}}${component}`),
                loading() {
                  if (url === "/") return null;
                  return <div>Loading...</div>;
                },
                delay: 1000,
              })}
            />
          );
        })}
        {/* <Route
          component={Loadable({
            loader: () => import(`./pages/Err404`),
            loading: () => <div>Loading...</div>,
            delay: 300,
          })}
        /> */}
      </Switch>
    </HashRouter>
  );
};

export default Router;
