import { AppStore } from '@/store/app.store'
import { View } from '@tarojs/components'
import React from 'react'
import { useStore } from 'reto'
import { AtActivityIndicator } from 'taro-ui'

export const PageContainer = props => {
    const appStore = useStore(AppStore)

    return appStore.ready ? (
        <View className="px-1">{props.children}</View>
    ) : (
        <AtActivityIndicator size={100} mode="center"></AtActivityIndicator>
    )
}
