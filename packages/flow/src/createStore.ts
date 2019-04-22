import { createStore, applyMiddleware, combineReducers, Middleware } from "redux";
import asyncMiddleware from "./asyncMiddleware";
import handleReducer from "./handleReducer";
import IModel from "./model";
import { isEmptyObject } from "./helpers";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

export default (models: IModel[] | undefined, middleware: Middleware[]) => {
  let resultReducers: any = {};

  models &&
    models.forEach(model => {
      const { namespace } = model;
      if (resultReducers[namespace]) {
        throw new Error(`${namespace} is repeated in reducers`);
      }

      const currentReducers = handleReducer(model);
      resultReducers = Object.assign({}, resultReducers, {
        [namespace]: currentReducers,
      });
    });

  if (!resultReducers || isEmptyObject(resultReducers)) {
    resultReducers = {
      "*DEFAULT_REDUCER*": (state: any = 0) => state,
    };
  }
  const reducer = combineReducers(resultReducers);
  return createStore(
    reducer,
    composeWithDevTools(applyMiddleware(asyncMiddleware(), ...middleware)),
  );
};
