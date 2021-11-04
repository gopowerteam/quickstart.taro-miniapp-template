import type { Ref } from 'vue'
import { unref } from 'vue'

export function get<T>(target: Ref<T>): T
export function get<T>(target: Ref<T>, key: keyof T): T
export function get<T>(target: Ref<T>, key?: keyof T) {
  if (key == null) return unref(target)

  return unref(target)[key]
}
