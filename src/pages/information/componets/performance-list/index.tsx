import React, { Component, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtButton, AtCard, AtList, AtListItem } from 'taro-ui'

import 'taro-ui/dist/style/components/button.scss' // 按需引入
import './index.styl'

export const PerformanceList = props => {
    const { personalRuleIds, teamRuleIds } = props.data

    const renderPersonValues = () =>
        personalRuleIds.map(item => (
            <AtCard title={item.name} className="my-1">
                <AtList>
                    <AtListItem title="绩效模式" extraText="个人绩效" />
                    <AtListItem
                        title="核算基数"
                        extraText={item.level1Name.replace(/（.*/g, '')}
                    />
                    <AtListItem title="计算方式" extraText={item.level2Name} />
                </AtList>
            </AtCard>
        ))

    return <>{renderPersonValues()}</>
}
