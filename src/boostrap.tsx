import React from 'react'
import Taro from '@tarojs/taro'
import { useStore } from 'reto'
import { AppStore } from './store/app.store'
import 'taro-ui/dist/style/components/load-more.scss'
import 'taro-ui/dist/style/components/activity-indicator.scss'
import 'taro-ui/dist/style/components/button.scss'
import { boot } from './bootstrap/boot'
import { AuthService } from '@/http/services/dingtalk-service/auth.service'
import { RequestParams } from '@gopowerteam/http-request'
import { appConfig } from '@/config/app.config'
import { UserStore } from './store/user.store'

const authService = new AuthService()

export const BootStrap = props => {
    const store = useStore(AppStore)
    const userStore = useStore(UserStore)

    /**
     * 用户登录
     * @returns
     */
    function userLogin() {
        return new Promise((resolve, reject) =>
            dd.getAuthCode({
                success: function({ authCode }) {
                    authService
                        .loginByCode(
                            new RequestParams(
                                {},
                                {
                                    append: {
                                        agentId: appConfig.agentId,
                                        code: authCode
                                    }
                                }
                            )
                        )
                        .subscribe({
                            next: data => {
                                const user = JSON.parse(data.body)
                                userStore.setCurrent(user)
                                console.log(user)
                            },
                            complete: () => {
                                resolve(true)
                            }
                        })
                },
                fail: function(err) {
                    resolve(err)
                }
            })
        )
    }

    // 启动逻辑
    function launch() {
        return Promise.all([userLogin()])
    }

    // 系统初始化
    async function startup() {
        if (store.ready) {
            return
        }

        Taro.showLoading({
            title: 'Loading...',
            mask: true
        })
        await boot()
        await launch()
        store.updateReady()
        Taro.hideLoading()
    }

    startup()

    return props.children
}
