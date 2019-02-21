import { connect, MapStateToPropsFactory, MapStateToProps } from "react-redux";
import { isFunction } from "./helpers";
import { actions } from "./handleAction";
import { ReactElement, ReactComponentElement, ReactNode, Component, ComponentType } from "react";
import { IActions } from "./action";
import { Dispatch } from "redux";

/**
 * 检查配置项
 * @param {Object} config
 */
function check(config: any) {
  const { component, state, actions: _actions } = config;
  if (!component) throw new Error("make sure `component` is a React.Component.");
  if (state && !isFunction(state)) throw new Error("make sure `state` is a Function.");
  if (_actions && !isFunction(_actions)) throw new Error("make sure `actions` is a Function.");
}

/**
 * 获取所有的actions
 *
 * @param {*} actions
 */
function getActions(actions: IActions): any {
  const result: any = {};
  for (const key in actions) {
    const action = actions[key];
    result[key] = (...rest: any) => action(...rest);
  }

  return result;
}

interface ICreateContainerOpts {
  namespace?: string;
  state?: any;
  actions?: any;
  mergeProps?: any;
  options?: any;
}
/**
 * 创建container，包裹了connect函数
 *
 * @param {React.Component} component 被关联的React组件
 * @param {Object} opts 配置项
 * @param {String} opts.namespace 需要关联的namespace
 * @param {Function} opts.state state的过滤函数，同react-redux中connect函数的mapStateToProps。第一个参数，如果配置了`namespace`属性，则是`namespace`下的state
 * @param {Function} opts.actions actions过滤函数，类似react-redux中connect函数的mapDispatchToProps。第一个参数，如果配置了`namespace`属性，则是`namespace`下的actions
 * @param {Function} opts.mergeProps 同react-redux中connect函数的mergeProps
 * @param {Object} opts.options 同react-redux中connect函数的options
 *
 */
export default function createContainer(component: ComponentType, opts: ICreateContainerOpts = {}) {
  check(Object.assign({}, { component }, opts));
  const { state: _state, actions: _actions, namespace, mergeProps, options } = opts;

  let mapStateToProps = null;
  let mapDispatchToProps = null;

  mapStateToProps = (originState: any, ownProps: any) => {
    let tempState = originState;
    if (namespace) tempState = tempState[namespace];
    if (isFunction(_state)) tempState = _state(tempState, ownProps);

    return { state: tempState };
  };

  mapDispatchToProps = (dispatch: Dispatch, ownProps: any) => {
    let tempActions: IActions = {};

    for (const key in actions) {
      const actionByNamespace = actions[key];
      tempActions[key] = getActions(actionByNamespace);
      actions[key] = tempActions[key];
    }
    if (namespace) tempActions = tempActions[namespace];
    if (isFunction(_actions)) tempActions = _actions(tempActions, ownProps);

    return { actions: tempActions };
  };

  return connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    options
  )(component);
}
