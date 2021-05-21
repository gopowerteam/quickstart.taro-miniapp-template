import React, { Component, useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import {
    AtAvatar,
    AtButton,
    AtList,
    AtListItem,
    AtSegmentedControl
} from 'taro-ui'

import 'taro-ui/dist/style/components/button.scss' // 按需引入
import './index.styl'

import { useStore } from 'reto'
import { AppStore } from '@/store/app.store'
import { UserStore } from '@/store/user.store'
import { PageContainer } from '@/shared/components/page-container'
import Router from 'tarojs-router-next'
import { SalaryvalueService } from '@/http/services/salary-service/salaryvalue.service'
import { RequestParams } from '@gopowerteam/http-request'
import { Params } from './route.config'

import { SalaryList } from './componets/salary-list'
import { PerformanceList } from './componets/performance-list'
import { Salary_informService } from '@/http/services/salary-service/salary_inform.service'

const salaryvalueService = new SalaryvalueService()
const salaryInformService = new Salary_informService()

export default () => {
    const [segment, setSegment] = useState(0)
    const [dataSource, setDataSource] = useState<any>()
    const userStore = useStore(UserStore)
    const user = userStore.current as any
    const params = Router.getParams() as Params

    const confirmState = {
        未下发: {
            text: '未下发',
            state: false
        },
        已下发: {
            text: '确认无误',
            state: true
        },
        已确认: {
            text: '已确认',
            state: false
        },
        未否认: {
            text: '已确认',
            state: false
        }
    }

    useEffect(() => {
        salaryvalueService
            .mySalary(
                new RequestParams(
                    {},
                    {
                        append: { month: params.month }
                    }
                )
            )
            .subscribe(data => {
                setDataSource(data)
            })
    }, [])

    function onChangeSegment(value) {
        setSegment(value)
    }

    // Segment视图
    const segmentView = [SalaryList, PerformanceList]
    const SegmentContent = segmentView[segment]

    const confirmSalary = () =>
        salaryInformService
            .confirm(
                new RequestParams(
                    {},
                    {
                        append: { month: params.month }
                    }
                )
            )
            .subscribe(data => {})

    return (
        <PageContainer>
            <AtSegmentedControl
                values={['薪资', '绩效']}
                current={segment}
                onClick={onChangeSegment}
            ></AtSegmentedControl>
            {dataSource && (
                <>
                    <SegmentContent data={dataSource}></SegmentContent>
                    <AtButton
                        type="primary"
                        className="m-1"
                        onClick={() => confirmSalary()}
                        disabled={!confirmState[dataSource.msgStatus].state}
                    >
                        {confirmState[dataSource.msgStatus].text}
                    </AtButton>
                </>
            )}
        </PageContainer>
    )
}
