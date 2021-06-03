import React, { useEffect } from 'react'
import { useStore } from 'reto'
import { AppStore } from '../../store/app.store'
import 'taro-ui/dist/style/components/load-more.scss'
import 'taro-ui/dist/style/components/activity-indicator.scss'
import 'taro-ui/dist/style/components/button.scss'
import { boot } from '../../bootstrap/boot'
import { AuthService } from '@/http/services/dingtalk-service/auth.service'
import { RequestParams } from '@gopowerteam/http-request'
import { appConfig } from '@/config/app.config'
import { UserStore } from '../../store/user.store'
import { catchError, switchMap, tap } from 'rxjs/operators'
import { EmployeeService } from '../../http/services/dingtalk-service/employee.service'
import { DepartmentService } from '../../http/services/dingtalk-service/department.service'
import { DeptStore } from '../../store/dept.store'
import { AtMessage } from 'taro-ui'
import Taro, { getCurrentInstance } from '@tarojs/taro'
import { lastValueFrom, from, EMPTY } from 'rxjs'
import { AtActivityIndicator } from 'taro-ui'
import Router, { NavigateType } from 'tarojs-router-next'

const authService = new AuthService()
const employeeService = new EmployeeService()
const departmentService = new DepartmentService()

export default props => {
    const store = useStore(AppStore)
    const userStore = useStore(UserStore)
    const deptStore = useStore(DeptStore)
    const $instance = getCurrentInstance()
    /**
     * 用户登录
     * @returns
     */
    async function userLogin() {
        // 通过code获取用户ID
        const getUserIdByCode = code =>
            authService.loginByCode(
                new RequestParams(
                    {},
                    {
                        append: {
                            agentId: appConfig.agentId,
                            code
                        }
                    }
                )
            )

        const replaceUserID = id => {
            const target = {
                '021926232927258548': '1864100214788174',
                '316469192621613595': '111629236737878375',
                '044837536726236323': '1864100214788174'
            }[id]

            return target || id
        }
        // 通过用户id获取用户数据
        const getUserInfoById = userid =>
            employeeService.getById(
                new RequestParams(
                    {},
                    { append: { id: userid } }
                    // { append: { id: replaceUserID(userid) } }
                )
            )

        // try {
        //     const { authCode } = await dd.getAuthCode()
        //     const { userid } = await getUserIdByCode(authCode).toPromise()
        //     const userData = await getUserInfoById(userid).toPromise()
        //     console.log(userData)
        //     userStore.setCurrent(userData)
        // } catch (ex) {
        //     Taro.showToast({
        //         title: JSON.stringify(ex),
        //         duration: 5000
        //     })
        // }
        return lastValueFrom(
            from(dd.getAuthCode() as Promise<any>).pipe(
                switchMap(({ authCode }) => getUserIdByCode(authCode)),

                switchMap(({ userid }) => getUserInfoById(userid)),

                catchError(ex => {
                    setTimeout(() => {
                        Taro.showToast({
                            title: '用户登录失败,请稍后重试',
                            duration: 5000
                        })
                    }, 5000)
                    return EMPTY
                })
            )
        ).then(data => {
            userStore.setCurrent(data)
        })
    }

    function getDeptList() {
        return lastValueFrom(
            departmentService.getAll(new RequestParams())
        ).then(data => {
            deptStore.setDeptList(data)
        })
    }

    function update() {
        const updateManager = Taro.getUpdateManager()
        updateManager.onUpdateReady(function() {
            Taro.showModal({
                title: '更新提示',
                content: '新版本已经准备好，是否重启应用？',
                success: function(res) {
                    if (res.confirm) {
                        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                        updateManager.applyUpdate()
                    }
                }
            })
        })
    }

    // 启动逻辑
    function launch() {
        update()
        return Promise.all([userLogin(), getDeptList()])
    }

    // 系统初始化
    async function startup() {
        if (store.ready) {
            return
        }

        await boot()

        await launch()

        store.updateReady()

        if ($instance.router?.params.page) {
            Router.navigate(
                { url: $instance.router?.params.page },
                {
                    params: JSON.parse(
                        decodeURI($instance.router?.params?.params || '{}')
                    )
                }
            )
        } else {
            Router.toIndex({ type: NavigateType.reLaunch })
        }
    }

    useEffect(() => {
        startup()
    }, [])

    return (
        <>
            <AtMessage />
            <AtActivityIndicator size={100} mode="center"></AtActivityIndicator>
        </>
    )
}
