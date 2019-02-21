export interface IEffect {
  (actions: any, payload: any, getState: any): void;
}

export interface IEffects {
  [name: string]: IEffect;
}

export interface IAllEffects {
  [name: string]: IEffects;
}

export interface IReducer {
  (state: any, payload: any): void;
}

export interface IReducers {
  [name: string]: IReducer;
}

export interface IModels {
  [name: number]: IModel;
}

export default interface IModel {
  namespace: string;
  state?: object | null | undefined | string | number;
  reducer?: IReducers;
  effect?: IEffects;
}
