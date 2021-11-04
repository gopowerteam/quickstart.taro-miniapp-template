import { IState } from './state'

/**
 * 系统准备完毕
 * @param state
 */
function ready(state: IState) {
  return () => {
    state.ready = true
  }
}

/**
 * 创建Action
 * @param state
 */
export function createAction(state: IState) {
  return {
    ready: ready(state)
  }
}
