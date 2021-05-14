import { useLocalStorageState } from 'ahooks'
import React from 'react'
import { Provider } from 'reto'

export function UserStore() {
    const [current, setCurrent] = useLocalStorageState('current', null)

    return {
        current,
        setCurrent
    }
}

export const UserStoreProvider = props => (
    <Provider of={UserStore}>{props.children}</Provider>
)
