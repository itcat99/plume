import { SEP } from "./constants";
import { Reducer } from "react";
import IModel from "./model";
import IAction from "./action";

export default function handleReducer(model: IModel): Reducer<any, IAction> {
  const { reducer, state: defaultState, namespace } = model;

  return (state = defaultState || 0, action = { type: "*PLUME_DEFAULT_ACTION*" }) => {
    let tempState = state;
    const { type: currentType, payload } = action;
    const [currentNamespace, realType] = currentType.split(SEP);
    const type = realType || currentNamespace;

    for (let key in reducer) {
      if (key === type && currentNamespace === namespace) {
        tempState = reducer[key](state, payload);
      }
    }

    return tempState;
  };
}
