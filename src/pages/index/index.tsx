import { Component } from 'react'
import { View, Text } from '@tarojs/components'
import { AtButton } from 'taro-ui'

import 'taro-ui/dist/style/components/button.scss' // 按需引入
import './index.styl'
import { useStore } from 'reto'
import { AppStore } from '@/store/app.store'

export default () => {
    const appStore = useStore(AppStore)
    console.log(appStore)
    return (
        <View className="index">
            <Text>Hello world!</Text>
            <AtButton type="primary">I need Taro UI</AtButton>
            <Text>Taro UI 支持 Vue 了吗111？</Text>
            <AtButton type="primary" circle={true}>
                支持
            </AtButton>
            <Text>共建？</Text>
            <AtButton type="secondary" circle={true}>
                来
            </AtButton>
        </View>
    )
}
