import React, { Component, useEffect, useState } from 'react'
import {
    AtAccordion,
    AtButton,
    AtFab,
    AtList,
    AtListItem,
    AtSegmentedControl
} from 'taro-ui'
import { Text } from '@tarojs/components'

import Taro from '@tarojs/taro'
import 'taro-ui/dist/style/components/button.scss' // 按需引入
import 'taro-ui/dist/style/components/fab.scss'

import './index.styl'
import { useStore } from 'reto'
import { UserStore } from '@/store/user.store'
import { PageContainer } from '@/shared/components/page-container'
import Router from 'tarojs-router-next'
import { Inner_rewardService } from '@/http/services/salary-service/inner_reward.service'
import { RequestParams } from '@gopowerteam/http-request'
import { Empty } from '@/shared/components/empty'
import { groupBy } from '@/shared/utils/common.util'

const innerRewardService = new Inner_rewardService()

export default () => {
    const userStore = useStore(UserStore)
    const [segment, setSegment] = useState(0)
    const [dataSource, setDataSource] = useState<any[]>([])

    const getDataSource = () => {
        innerRewardService.getMyList(new RequestParams()).subscribe(data => {
            setDataSource(data)
        })
    }

    useEffect(() => {
        getDataSource()
    }, [])

    const onChangeSegment = value => {
        setSegment(value)
    }

    const onSubmit = id => {
        innerRewardService
            .apply(new RequestParams({}, { append: { id } }))
            .subscribe({
                next: data => {
                    // 更新数据源
                    getDataSource()
                    Taro.showToast({
                        title: '已提交申报',
                        icon: 'success',
                        duration: 2000
                    })
                },
                error: msg => {
                    Taro.showToast({
                        title: '提交申报失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
    }

    const list = dataSource.filter(item =>
        [x => x.type === '待申报', x => x.type !== '待申报'][segment](item)
    )

    return (
        <PageContainer>
            <AtSegmentedControl
                values={['待申报', '已申报']}
                current={segment}
                onClick={onChangeSegment}
            ></AtSegmentedControl>
            {list && list.length ? (
                Object.entries(groupBy(list, 'month')).map(([key, values]) => (
                    <AtAccordion isAnimation={false} title={key}>
                        {values.map(item => (
                            <AtList
                                hasBorder
                                className="my-2 border border-solid rounded"
                            >
                                <AtListItem
                                    title="奖励类型"
                                    extraText={item.rewardRuleName}
                                />
                                <AtListItem
                                    title="日期"
                                    extraText={item.month}
                                />
                                <AtListItem
                                    title="客户姓名"
                                    extraText={item.clientName}
                                />
                                <AtListItem
                                    title="消费金额"
                                    extraText={`${item.amount / 100}元`}
                                />
                                <AtListItem
                                    title="申报状态"
                                    extraText={item.type}
                                />
                                <AtListItem
                                    title="奖励金额"
                                    extraText={`${item.reward / 100}元`}
                                />
                                {segment === 0 && (
                                    <AtButton
                                        size="small"
                                        className="my-1"
                                        type="primary"
                                        onClick={() => onSubmit(item.id)}
                                    >
                                        申报
                                    </AtButton>
                                )}
                            </AtList>
                        ))}
                    </AtAccordion>
                ))
            ) : (
                <Empty></Empty>
            )}
            <AtFab
                className="absolute bottom-1 right-1"
                onClick={() => {
                    Router.toRewardCreate().then(() => {
                        getDataSource()
                    })
                }}
            >
                <Text className="at-fab__icon at-icon at-icon-add"></Text>
            </AtFab>
        </PageContainer>
    )
}
