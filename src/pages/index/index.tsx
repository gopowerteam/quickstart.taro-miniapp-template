import React, { Component, useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { AtAvatar, AtButton, AtIcon, AtList, AtListItem } from 'taro-ui'

import 'taro-ui/dist/style/components/button.scss' // 按需引入
import './index.styl'
import { useStore } from 'reto'
import { UserStore } from '@/store/user.store'
import { PageContainer } from '@/shared/components/page-container'
import Router from 'tarojs-router-next'
import { SalaryvalueService } from '@/http/services/salary-service/salaryvalue.service'
import { RequestParams } from '@gopowerteam/http-request'
import { useDebounceEffect } from 'ahooks'
import { Empty } from '@/shared/components/empty'

const today = new Date()
const salaryValueService = new SalaryvalueService()
export default () => {
    const userStore = useStore(UserStore)
    const user = userStore.current as any
    const [dataSource, setDataSource] = useState<any>()
    const [currentYear, setCurrentYear] = useState(today.getFullYear())

    const getSalaryList = () => {
        salaryValueService.mySalaryList(new RequestParams()).subscribe(data => {
            const groups = getSalaryListByYear(data)
            setDataSource(groups)
        })
    }

    const onChangeYear = value => {
        setCurrentYear(Math.min(currentYear + value, today.getFullYear()))
    }

    const getSalaryListByYear = data => {
        return data.reduce((result, item) => {
            const month = item.month.slice(0, 4)
            if (month && month.length === 4) {
                let target = result[month]

                if (!target) {
                    target = []
                    result[month] = target
                }

                target.push(item)
            }

            return result
        }, {})
    }

    useEffect(() => {
        getSalaryList()
    }, [])

    function renderUserContainer() {
        return (
            <View className="border p-1 flex justify-between items-center">
                <View className="ml-2">
                    <View>你好,{user?.name}</View>
                </View>
                <AtAvatar circle text={user?.name}></AtAvatar>
            </View>
        )
    }

    function renderActionContainer() {
        return (
            <AtList className="border p-1 mt-1">
                <AtListItem
                    title="我的薪资结构"
                    onClick={() => Router.toInformation()}
                    arrow="right"
                />
                <AtListItem
                    title="其他奖励申报"
                    arrow="right"
                    onClick={() => Router.toReward()}
                />
            </AtList>
        )
    }

    function renderSalaryContainer() {
        const list = dataSource ? dataSource[currentYear] || [] : []
        return (
            <View className="border p-1 mt-1">
                <View className="flex justify-between items-center">
                    <AtIcon
                        value="chevron-left"
                        size="30"
                        color="#000"
                        onClick={() => onChangeYear(1)}
                    ></AtIcon>
                    <View>{currentYear}年</View>
                    <AtIcon
                        value="chevron-right"
                        size="30"
                        color="#000"
                        onClick={() => onChangeYear(-1)}
                    ></AtIcon>
                </View>
                <AtList className="mt-1">
                    {list.length ? (
                        list.map(item => (
                            <AtListItem
                                onClick={() =>
                                    Router.toSalary({
                                        params: { month: item.month }
                                    })
                                }
                                title={`${item.month}工资条`}
                            ></AtListItem>
                        ))
                    ) : (
                        <Empty />
                    )}
                </AtList>
            </View>
        )
    }

    return (
        <PageContainer>
            {renderUserContainer()}
            {renderActionContainer()}
            {renderSalaryContainer()}
        </PageContainer>
    )
}
