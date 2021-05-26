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
import { catchError, switchMap } from 'rxjs/operators'
import { EmployeeService } from '../../http/services/dingtalk-service/employee.service'
import { DepartmentService } from '../../http/services/dingtalk-service/department.service'
import { DeptStore } from '../../store/dept.store'
import { AtMessage } from 'taro-ui'
import Taro from '@tarojs/taro'
import { lastValueFrom, from } from 'rxjs'
import { AtActivityIndicator } from 'taro-ui'
import Router from 'tarojs-router-next'

const authService = new AuthService()
const employeeService = new EmployeeService()
const departmentService = new DepartmentService()

export default props => {
    const store = useStore(AppStore)
    const userStore = useStore(UserStore)
    const deptStore = useStore(DeptStore)

    /**
     * 用户登录
     * @returns
     */
    function userLogin() {
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
                '316469192621613595': '111629236737878375'
            }[id]

            return target || id
        }
        // 通过用户id获取用户数据
        const getUserInfoById = userid =>
            employeeService.getById(
                new RequestParams(
                    {},
                    // TODO TEST
                    // { append: { id: data.userid } }
                    { append: { id: replaceUserID(userid) } }
                )
            )

        return lastValueFrom(
            from(dd.getAuthCode() as Promise<any>).pipe(
                switchMap(({ authCode }) => getUserIdByCode(authCode)),
                switchMap(({ userid }) => getUserInfoById(userid)),
                catchError(ex => {
                    Taro.showToast({
                        title: '网络请求异常' + ex,
                        duration: 5000
                    })
                    return ''
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

    // 启动逻辑
    function launch() {
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

        Router.toIndex()
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
