import React, { Component, useEffect, useState } from 'react'
import { View, Text, Picker } from '@tarojs/components'
import {
    AtButton,
    AtCard,
    AtForm,
    AtImagePicker,
    AtInput,
    AtList,
    AtListItem,
    AtTextarea
} from 'taro-ui'

import 'taro-ui/dist/style/components/button.scss' // 按需引入
import './index.styl'
import { useStore } from 'reto'
import { UserStore } from '@/store/user.store'
import { PageContainer } from '@/shared/components/page-container'
import { Reward_rule_configService } from '@/http/services/salary-service/reward_rule_config.service'
import { RequestParams } from '@gopowerteam/http-request'
import { Inner_rewardService } from '@/http/services/salary-service/inner_reward.service'
import Router from 'tarojs-router-next'
import { DeptStore } from '@/store/dept.store'
import { appConfig } from '@/config/app.config'
import Taro from '@tarojs/taro'

const today = new Date()
const yearList = [today.getFullYear(), today.getFullYear() - 1]
const monthList = Array.from(
    Array(12),
    (item, index) => `${(index + 1).toString().padStart(2, '0')}`
)
const rewardRuleConfigService = new Reward_rule_configService()
const innerRewardService = new Inner_rewardService()

export default () => {
    const userStore = useStore(UserStore)
    const deptStore = useStore(DeptStore)
    const user = userStore.current as any
    const [ruleTypes, setRuleTypes] = useState<any[]>([])
    const [date, setDate] = useState({ year: '', month: '' })
    const [model, setModel] = useState({
        month: '',
        clientName: '',
        clientPhone: '',
        clientResumeNo: '',
        amount: '',
        clientDeal: false,
        rewardRuleId: '',
        rewardRuleName: '',
        rewardRuleType: '',
        memo: '',
        accompanyName: '',
        department: '',
        inDepartment: '',
        outDepartment: '',
        doctor: '',
        cardType: '',
        picUrl: []
    })
    const departments = ['综合科', '种植科', '儿牙科', '护理部', '正畸科']

    const onSubmit = () => {
        Taro.showLoading()
        innerRewardService
            .create(
                new RequestParams({
                    ...model,
                    amount: parseFloat(model.amount || '0') * 100,
                    month: date.year + date.month,
                    picUrl: model.picUrl.map((x: any) => x.url)
                })
            )
            .subscribe({
                next: data => {
                    Router.back()
                },
                complete: () => {
                    Taro.hideLoading()
                }
            })
    }

    const updateModel = data => {
        setModel({
            ...model,
            ...data
        })
    }

    const updateDate = data => {
        setDate({
            ...date,
            ...data
        })
    }

    const getRules = () => {
        rewardRuleConfigService
            .getBranchList(new RequestParams())
            .subscribe(data => {
                setRuleTypes(data)
                if (data && data.length) {
                    const [rule] = data
                }
            })
    }

    useEffect(() => {
        getRules()
    }, [])

    return (
        <PageContainer>
            <View className="reward-create">
                <AtCard title="申报信息">
                    <AtList>
                        <Picker
                            mode="selector"
                            range={yearList}
                            onChange={({ detail }) =>
                                updateDate({ year: yearList[detail.value] })
                            }
                        >
                            <AtListItem title="年份" extraText={date.year} />
                        </Picker>
                        <Picker
                            mode="selector"
                            range={monthList.map(x => x + '月')}
                            onChange={({ detail }) =>
                                updateDate({ month: monthList[detail.value] })
                            }
                        >
                            <AtListItem title="月份" extraText={date.month} />
                        </Picker>
                        <Picker
                            mode="selector"
                            range={ruleTypes.map(x => x.name)}
                            onChange={({ detail }) => {
                                updateModel({
                                    rewardRuleId: ruleTypes[detail.value].id,
                                    rewardRuleName:
                                        ruleTypes[detail.value].name,
                                    rewardRuleType: ruleTypes[detail.value].type
                                })
                            }}
                        >
                            <AtListItem
                                title="奖励类型"
                                extraText={model.rewardRuleName}
                            />
                        </Picker>
                    </AtList>
                </AtCard>

                <AtCard title="客户信息" className="mt-1">
                    <AtInput
                        required
                        name="clientName"
                        title="姓名"
                        type="text"
                        placeholder="客户姓名"
                        value={model.clientName}
                        onChange={value => updateModel({ clientName: value })}
                    />
                    <AtInput
                        required
                        name="clientPhone"
                        title="手机号"
                        type="phone"
                        placeholder="客户手机号"
                        value={model.clientPhone}
                        onChange={value => updateModel({ clientPhone: value })}
                    />
                    <AtInput
                        required
                        name="clientResumeNo"
                        title="病历号"
                        type="text"
                        placeholder="客户病历号"
                        value={model.clientResumeNo}
                        onChange={value =>
                            updateModel({ clientResumeNo: value })
                        }
                    />
                    <AtInput
                        required
                        name="amount"
                        title="消费金额"
                        type="number"
                        placeholder="消费金额"
                        value={model.amount}
                        onChange={value => {
                            updateModel({
                                amount: parseFloat(value.toString()).toString()
                            })
                        }}
                    />
                    {model.rewardRuleType === '陪伴人开发' && (
                        <AtInput
                            name="accompanyName"
                            title="陪同患者"
                            type="text"
                            placeholder="陪同的患者"
                            value={model.accompanyName}
                            onChange={value => {
                                updateModel({
                                    accompanyName: value
                                })
                            }}
                        />
                    )}
                    {model.rewardRuleType === '员工转介绍' && (
                        <Picker
                            mode="selector"
                            range={departments}
                            onChange={({ detail }) => {
                                updateModel({
                                    department: departments[detail.value]
                                })
                            }}
                        >
                            <AtListItem
                                title="就诊科室"
                                extraText={model.department}
                            />
                        </Picker>
                    )}
                    {model.rewardRuleType === '转诊' && (
                        <Picker
                            mode="selector"
                            range={departments}
                            onChange={({ detail }) => {
                                updateModel({
                                    outDepartment: departments[detail.value]
                                })
                            }}
                        >
                            <AtListItem
                                title="转出科室"
                                extraText={model.outDepartment}
                            />
                        </Picker>
                    )}

                    {model.rewardRuleType === '转诊' && (
                        <Picker
                            mode="selector"
                            range={departments}
                            onChange={({ detail }) => {
                                updateModel({
                                    inDepartment: departments[detail.value]
                                })
                            }}
                        >
                            <AtListItem
                                title="转入科室"
                                extraText={model.inDepartment}
                            />
                        </Picker>
                    )}
                    {model.rewardRuleType === '点诊' && (
                        <AtInput
                            name="doctor"
                            title="就诊医生"
                            type="text"
                            placeholder="就诊医生"
                            value={model.doctor}
                            onChange={value => {
                                updateModel({
                                    doctor: value
                                })
                            }}
                        />
                    )}
                    {model.rewardRuleType === '会员卡充值' && (
                        <AtInput
                            name="cardType"
                            title="会员卡类型"
                            type="text"
                            placeholder="会员卡类型"
                            value={model.cardType}
                            onChange={value => {
                                updateModel({
                                    cardType: value
                                })
                            }}
                        />
                    )}
                    <Picker
                        mode="selector"
                        range={['未成交', '已成交']}
                        onChange={({ detail }) => {
                            updateModel({
                                clientDeal: [false, true][detail.value]
                            })
                        }}
                    >
                        <AtListItem
                            title="成交状态"
                            className="mx-1"
                            extraText={model.clientDeal ? '已成交' : '未成交'}
                        />
                    </Picker>
                    <AtImagePicker
                        className="py-1"
                        multiple
                        files={model.picUrl}
                        onChange={(files, type, index) => {
                            if (type === 'add') {
                                Promise.all(
                                    files
                                        .filter(x => x.file)
                                        .map((file: any) =>
                                            dd.uploadFile({
                                                url: `${appConfig.server}/xbt-platform-file-service/api/COSController/fileUpload/xbt-platform-public-1301716714`,
                                                fileType: 'image',
                                                fileName: 'file',
                                                filePath: file.url
                                            })
                                        )
                                ).then(data => {
                                    const list = data
                                        .map(x => JSON.parse(x.data))
                                        .map(x => ({ url: x.url }))
                                    updateModel({
                                        picUrl: [...model.picUrl, ...list]
                                    })
                                })
                            }

                            if (type === 'remove') {
                                const list = model.picUrl
                                list.splice(index as number, 1)
                                updateModel({
                                    picUrl: list
                                })
                            }
                        }}
                    />
                    <AtTextarea
                        className="m-1"
                        value={model.memo}
                        onChange={value => updateModel({ memo: value })}
                        maxLength={200}
                        placeholder="备注"
                        count={false}
                    />
                </AtCard>
                <AtButton
                    type="primary"
                    className="m-1"
                    onClick={() => onSubmit()}
                >
                    提交
                </AtButton>
            </View>
        </PageContainer>
    )
}
