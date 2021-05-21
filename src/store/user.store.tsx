import { useLocalStorageState } from 'ahooks'
import React, { useState } from 'react'
import { Provider, useStore } from 'reto'
import Taro from '@tarojs/taro'

export function UserStore() {
    const [current, updateCurrent] = useState()

    const setCurrent = user => {
        updateCurrent(user)
        Taro.setStorageSync('user', user)
    }

    return {
        current,
        setCurrent
    }
}

export const UserStoreProvider = props => (
    <Provider of={UserStore}>{props.children}</Provider>
)
