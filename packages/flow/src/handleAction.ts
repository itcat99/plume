import IModel from "./model";
import IAction, { IActions, IAllActions } from "./action";
import { SEP } from "./constants";
import { dispatch } from "./asyncMiddleware";

interface ICreateActionConfig {
  type: string;
  namespace: string;
  isEffect?: boolean;
}

const createAction = (dispatch: any, config: ICreateActionConfig): any => {
  const { type, namespace, isEffect } = config;

  return (payload: any): any =>
    dispatch({
      type: `${namespace}${SEP}${type}`,
      payload,
      isEffect,
    });
};

export const actions: IAllActions = {};

export default (models: IModel[]): void => {
  models.forEach(model => {
    const { namespace, reducer, effect } = model;
    let tempActions: IActions = {};

    for (const key in reducer) {
      tempActions[key] = createAction(dispatch, { namespace, type: key });
    }

    for (const key in effect) {
      tempActions[key] = createAction(dispatch, { namespace, type: key, isEffect: true });
    }

    actions[namespace] = tempActions;
  });
};
