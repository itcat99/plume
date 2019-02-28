import React from "react";
import {HashRouter, Route, Switch} from "react-router-dom";

import Loadable from "react-loadable";
import pagesInfo from "./pagesInfo.json";

export default props => {
  const {pagePath} = props;

  return (
    <HashRouter>
      <Switch>
        {pagesInfo.map((route, index) => {
          const {title, path: url} = route;

          return (<Route
            exact={url === "/"
            ? true
            : false}
            path={url}
            key={`${url}_${index}`}
            component={Loadable({
            loader: () => import (`{{relativePath}}/${title}`),
            loading: () => {
              if (url === "/") 
                return null;
              return <div>Loading...</div>;
            },
            delay: 1000
          })}/>);
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
