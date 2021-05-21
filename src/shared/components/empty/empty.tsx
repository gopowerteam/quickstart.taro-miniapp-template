import { View } from '@tarojs/components'
import React from 'react'


export const Empty = props => {
    const description = props.description || '暂无数据'
    return <View className="py-5 text-center m-1">{description}</View>
}
