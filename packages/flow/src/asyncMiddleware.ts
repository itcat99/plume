import { effects } from "./handleEffect";
import { actions } from "./handleAction";
import { SEP } from "./constants";
import IAction from "./action";
import { IEffect } from "./model";

function warning(): void {
  throw new Error(
    'You are calling "dispatch" or "getState" without applying PlumeMiddleware! ' +
      "Please create your store with PlumeMiddleware first!",
  );
}

export let dispatch = warning;
export let getState = warning;

export default () => (store: any) => {
  dispatch = store.dispatch;
  getState = store.getState;

  return (next: any) => (action: IAction) => {
    const { isEffect } = action;
    let result: IEffect | void;

    if (isEffect) {
      const { type, payload } = action;
      const [namespace, realType] = type.split(SEP);

      result = effects[namespace][realType](actions, payload, getState);
    } else {
      result = next(action);
    }

    return result;
  };
};
