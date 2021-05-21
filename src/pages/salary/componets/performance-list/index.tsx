import React, { Component, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtButton, AtCard, AtList, AtListItem } from 'taro-ui'

import 'taro-ui/dist/style/components/button.scss' // 按需引入
import './index.styl'

export const PerformanceList = props => {
    const { personalValues, teamValues } = props.data

    const renderPersonValues = () =>
        personalValues.map(item => (
            <AtCard title={item.name} className="my-1">
                <AtList>
                    <AtListItem title="绩效类型" extraText="个人绩效" />
                    <AtListItem
                        title="绩效金额"
                        extraText={`${item.output / 100}元`}
                    />
                </AtList>
            </AtCard>
        ))

    return <>{renderPersonValues()}</>
}
