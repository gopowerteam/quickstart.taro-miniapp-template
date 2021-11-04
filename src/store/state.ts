import { reactive } from 'vue'

export interface IState {
  ready: boolean
  token: string
}

/**
 *  数据状态
 */
export const State: IState = {
  ready: false,
  token: ''
}

export function createState() {
  return reactive(State)
}
