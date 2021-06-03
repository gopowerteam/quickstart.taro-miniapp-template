import React, { Component, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtButton, AtCard, AtList, AtListItem } from 'taro-ui'

import 'taro-ui/dist/style/components/button.scss' // 按需引入
import './index.styl'
import { groupBy } from '@/shared/utils/common.util'

export const SalaryList = props => {
    const { data } = props
    const { fixedItemList } = data

    const groups = groupBy(fixedItemList, 'category')
    return (
        <View className="py-1">
            <AtCard title="基础信息">
                <AtList>
                    <AtListItem
                        title="员工姓名"
                        extraText={data.employeeName}
                    ></AtListItem>
                    <AtListItem
                        title="保底类型"
                        extraText={data.thresholdType}
                    ></AtListItem>
                    <AtListItem
                        title="保底工资"
                        extraText={`${data.threshold / 100}元`}
                    ></AtListItem>
                </AtList>
            </AtCard>
            {Object.entries(groups).map(([title, items]) => (
                <AtCard title={title} className="mt-1">
                    <AtList>
                        {items.map(item => (
                            <AtListItem
                                title={item.name}
                                extraText={`${item.value / 100}元`}
                            />
                        ))}
                    </AtList>
                </AtCard>
            ))}
        </View>
    )
}
