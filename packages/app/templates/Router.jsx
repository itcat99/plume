/* eslint-disable react/display-name */
import React from "react";
import { HashRouter, BrowserRouter, Route, Switch } from "react-router-dom";

import Loadable from "react-loadable";
import pagesInfo from "./pagesInfo.json";

const SwitchRoute = () => {
  return (
    <Switch>
      {pagesInfo.map((route, index) => {
        const { exact, path: url, component, author } = route;
        let loadableComponent;
        if (author) {
          loadableComponent = Loadable.Map({
            loader: {
              Author: () => import(`{{relativePath}}${author}`),
              Cmp: () => import(`{{relativePath}}${component}`),
            },
            render(loaded, props) {
              const Author = loaded.Author.default;
              const Cmp = loaded.Cmp.default;

              return (
                <Author>
                  <Cmp {...props} />
                </Author>
              );
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

        return (
          <Route exact={exact} path={url} key={`${url}_${index}`} component={loadableComponent} />
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
