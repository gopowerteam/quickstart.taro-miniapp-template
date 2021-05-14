import React from 'react'
import { useState } from 'react'
import { Provider } from 'reto'

export function AppStore() {
    const [ready, setReady] = useState(false)

    const actions = {
        updateReady: () => {
            setReady(true)
        }
    }

    return {
        ready,
        ...actions
    }
}

export const AppStoreProvider = props => (
    <Provider of={AppStore}>{props.children}</Provider>
)
