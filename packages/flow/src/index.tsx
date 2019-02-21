// import * as React from "react";
import * as React from "react";
import { ReactElement } from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import handleAction, { actions } from "./handleAction";
import { isEmptyObject } from "./helpers";
import createStore from "./createStore";

import CreateContainer from "./createContainer";
import IModel from "./model";
import handleEffect from "./handleEffect";
import { Middleware } from "redux";

interface IOption {
  target?: string;
  app?: ReactElement;
  middlewares?: Middleware[];
  models?: IModel[];
}

const DEFAULT: IOption = {
  target: "root",
  app: <div>Hello Plume!</div>,
  models: [],
  middlewares: [],
};

const DEFAULT_MODEL: IModel = {
  namespace: "*PLUMECORE*",
  state: 0,
  reducer: {
    plus: state => state + 1,
  },
};

class Plume {
  opts: IOption;
  private _models: any;

  constructor(options: IOption) {
    this.opts = Object.assign({}, DEFAULT, options);

    this._models = this.opts.models;
    this.init();
  }

  init(): void {
    /* 如果没有model 注册默认model */
    if (!this._models || isEmptyObject(this._models)) {
      console.warn(`Failure to detect the model will take the default model`);
      this._models = [DEFAULT_MODEL];
    }

    this.checkModel(this._models);
  }

  checkModel(models: IModel[]) {
    let cacheNamespace: string | null = null;
    models.forEach(model => {
      let cacheKey: string | null = null;
      const { namespace, effect, reducer } = model;
      /* model必须有namespace */
      if (!namespace) throw new Error("Model must have a namespace");
      /* 不能有相同namespace的model */
      if (namespace === cacheNamespace)
        throw new Error(`Models have the same namespace: ${namespace}, please checke it.`);
      /* 在一个model内，至少需要一个reducer或者effect方法 */
      if ((!effect || isEmptyObject(effect)) && (!reducer || isEmptyObject(reducer))) {
        throw new Error(`reducer and effect need at least one`);
      }

      if (reducer) {
        for (const key in reducer) {
          /* 在相同的namespace不能有同样名字的reducer或者effect */
          if (cacheKey === key)
            throw new Error(`Has same reducer function: ${key} in namespace: ${namespace}`);
          cacheKey = key;
        }
      }

      if (effect) {
        for (const key in effect) {
          if (cacheKey === key)
            /* 在相同的namespace不能有同样名字的reducer或者effect */
            throw new Error(`Has same effect function: ${key} in namespace: ${namespace}`);
          cacheKey = key;
        }
      }

      cacheNamespace = namespace;
    });
  }
  run(): void {
    const { models, target, middlewares, app } = this.opts;
    const store = createStore(models, middlewares || []);

    handleAction(this._models);
    handleEffect(this._models);

    ReactDOM.render(
      <Provider store={store}>{app}</Provider>,
      document.getElementById(target || "root")
    );
  }
}

export const plume = Plume;
export { CreateContainer };
export default Plume;
