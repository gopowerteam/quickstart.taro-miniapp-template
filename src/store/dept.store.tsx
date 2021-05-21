import { useLocalStorageState } from 'ahooks'
import React, { useState } from 'react'
import { Provider, useStore } from 'reto'
import Taro from '@tarojs/taro'

export function DeptStore() {
    const [deptList, setDeptList] = useState<any[]>([])

    function getSubDept(id: number | number[]) {
        if (id instanceof Array) {
            return deptList.filter(x => id.includes(x.parentId))
        } else {
            return deptList.filter(x => x.parentId === id)
        }
    }

    return {
        deptList,
        setDeptList,
        getSubDept
    }
}

export const DeptStoreProvider = props => (
    <Provider of={DeptStore}>{props.children}</Provider>
)
