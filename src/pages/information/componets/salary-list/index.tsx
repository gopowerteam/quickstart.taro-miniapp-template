import React, { Component, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtButton, AtCard, AtList, AtListItem } from 'taro-ui'

import 'taro-ui/dist/style/components/button.scss' // 按需引入
import './index.styl'
import { groupBy } from '@/shared/utils/common.util'

export const SalaryList = props => {
    const { fixedItemList } = props.data

    const groups = groupBy(fixedItemList, 'category')
    return (
        <>
            {Object.entries(groups).map(([title, items]) => (
                <AtCard title={title} className="my-1">
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
        </>
    )
}
