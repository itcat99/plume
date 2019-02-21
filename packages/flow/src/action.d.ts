export default interface IAction {
  type: string;
  payload?: any;
  isEffect?: boolean;
}

export interface IActions {
  [name: string]: any;
}

export interface IAllActions {
  [name: string]: IActions;
}
