/* eslint-disable react/display-name */
import React from "react";
import { HashRouter, BrowserRouter, Route, Switch } from "react-router-dom";

import Loadable from "react-loadable";
import pagesInfo from "./pagesInfo.json";

const SwitchRoute = () => {
  return (
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
              loading: () => {
                if (url === "/") return null;
                return <div>Loading...</div>;
              },
              delay: 1000,
            })}
          />
        );
      })}
      <Route
        component={Loadable({
          loader: () => import(`{{errorPages}}/404`),
          loading: () => <div>Loading...</div>,
          delay: 300,
        })}
      />
    </Switch>
  );
};

const Router = hashRouter => {
  return hashRouter === "true" ? (
    <HashRouter>
      <SwitchRoute />
    </HashRouter>
  ) : (
    <BrowserRouter>
      <SwitchRoute />
    </BrowserRouter>
  );
};

export default Router;
