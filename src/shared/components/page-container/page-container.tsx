import { AppStore } from '@/store/app.store'
import { View } from '@tarojs/components'
import React from 'react'

export const PageContainer = props => {
    return <View className="px-1">{props.children}</View>
}
