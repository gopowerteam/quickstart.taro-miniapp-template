import React, { Component, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtButton, AtCard, AtList, AtListItem } from 'taro-ui'

import 'taro-ui/dist/style/components/button.scss' // 按需引入
import './index.styl'
import { groupBy } from '@/shared/utils/common.util'

export const SalaryList = props => {
    const {
        valueList,
        finalFinalIncome,
        fixedSalary,
        ss,
        tax,
        totalSalary,
        varianceSalary
    } = props.data

    const groups = groupBy(valueList, 'category')

    const renderTotalSalaryContainer = () => {
        return (
            <AtCard title="薪资统计" className="my-1">
                <AtList>
                    <AtListItem
                        title="固定工资"
                        extraText={`${fixedSalary / 100}元`}
                    />
                    <AtListItem
                        title="变动工资"
                        extraText={`${varianceSalary / 100}元`}
                    />
                    <AtListItem title="社保代扣" extraText={`${ss / 100}元`} />
                    <AtListItem
                        title="个人所得税"
                        extraText={`${tax / 100}元`}
                    />
                    <AtListItem
                        title="合计薪资"
                        extraText={`${totalSalary / 100}元`}
                    />
                    <AtListItem
                        title="实发工资"
                        extraText={`${finalFinalIncome / 100}元`}
                    />
                </AtList>
            </AtCard>
        )
    }

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
            {renderTotalSalaryContainer()}
        </>
    )
}
