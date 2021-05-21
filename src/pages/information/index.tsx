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
import { UserStore } from '@/store/user.store'
import { PageContainer } from '@/shared/components/page-container'
import { EmployeesalaryService } from '@/http/services/salary-service/employeesalary.service'
import { RequestParams } from '@gopowerteam/http-request'
import { SalaryList } from './componets/salary-list'
import { PerformanceList } from './componets/performance-list'

const employeesalaryService = new EmployeesalaryService()
export default () => {
    const userStore = useStore(UserStore)
    const user = userStore.current as any

    const [dataSource, setDataSource] = useState<any>()

    useEffect(() => {
        employeesalaryService
            .getByEmployee(
                new RequestParams(
                    {},
                    {
                        append: {
                            employeeId: '1864100214788174'
                            // employeeId: user.userid
                        }
                    }
                )
            )
            .subscribe(data => {
                setDataSource(data)
            })
    }, [])

    const [segment, setSegment] = useState(0)
    function onChangeSegment(value) {
        setSegment(value)
    }

    // Segment视图
    const segmentView = [SalaryList, PerformanceList]
    const SegmentContent = segmentView[segment]

    return (
        <PageContainer>
            <AtSegmentedControl
                values={['工资结构', '绩效结构']}
                current={segment}
                onClick={onChangeSegment}
            ></AtSegmentedControl>
            {dataSource && <SegmentContent data={dataSource}></SegmentContent>}
        </PageContainer>
    )
}
