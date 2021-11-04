import { readonly } from 'vue'
import { createAction } from './action'
import { createState } from './state'

const state = createState()
const action = createAction(state)

const modules = {}

/**
 * Store
 */
export const useStore = () => {
  const store = {
    // state: createPersistStorage<IState>(state),
    state: readonly(state),
    action: readonly(action)
  }

  return {
    ...store,
    ...modules
  }
}

/**
 * 持久化存储
 * @param state
 * @param key
 */
// export function createPersistStorage<T>(state: any, key = 'default'): T {
//     const STORAGE_KEY = '-app-storage-'

//     // init value
//     Object.entries(getItem(key)).forEach(([key, value]) => {
//         state[key] = value
//     })

//     function setItem(state: any) {
//         const stateRow = getItem()
//         stateRow[key] = state
//         const stateStr = JSON.stringify(stateRow)
//         localStorage.setItem(STORAGE_KEY, stateStr)
//     }

//     function getItem(key?: string) {
//         const stateStr = localStorage.getItem(STORAGE_KEY) || '{}'
//         const stateRow = JSON.parse(stateStr) || {}
//         return key ? stateRow[key] || {} : stateRow
//     }

//     watch(state, () => {
//         const stateRow = toRaw(state)
//         setItem(stateRow)
//     })

//     return readonly(state)
// }
