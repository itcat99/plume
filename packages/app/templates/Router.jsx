/* eslint-disable react/display-name */
import React from "react";
import { HashRouter, BrowserRouter, Route, Switch } from "react-router-dom";

import Loadable from "react-loadable";
import pagesInfo from "./pagesInfo.json";

const SwitchRoute = () => {
  return (
    <Switch>
      {pagesInfo.map((route, index) => {
        const { exact, path: url, component, author, layout } = route;
        let loadableComponent;

        if (author || layout) {
          const loader = {
            Cmp: () => import(`../src/pages${component}`),
          };
          if (author) loader.Author = () => import(`../src/pages${author}`);
          if (layout) loader.Layout = () => import(`../src/pages${layout}`);

          loadableComponent = Loadable.Map({
            loader,
            render(loaded, props) {
              const Author = loaded.Author ? loaded.Author.default : null;
              const Layout = loaded.Layout ? loaded.Layout.default : null;
              const Cmp = loaded.Cmp.default;

              if (Author) {
                const children = Layout ? (
                  <Layout>
                    <Cmp {...props} />
                  </Layout>
                ) : (
                  <Cmp {...props} />
                );

                return <Author>{children}</Author>;
              }

              return (
                <Layout>
                  <Cmp {...props} />
                </Layout>
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
