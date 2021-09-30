// import { TokenService } from '../http/token.service'
import adapter from '@/bootstrap/http/adapter/dingtalk.adapter'
import { RequestService } from '@gopowerteam/http-request'
import { appConfig } from '@/config/app.config'
import { TokenService } from '../http/services/token.service'

export default function () {
    // 配置服务端信息
    RequestService.setConfig({
        server: appConfig.server,
        timeout: 30000,
        adapter: adapter
    })

    // 添加状态拦截器
    RequestService.interceptors.status.use(respone => {
        return respone.status === 200
    })

    // 添加成功拦截器
    RequestService.interceptors.success.use(respone => {
        return respone.data
    })

    // 添加失败拦截器
    RequestService.interceptors.error.use(respone => {
        return respone
    })

    // 网络异常处理
    RequestService.requestCatchHandle = respone => {
        const defaultError = '服务通讯连接失败'
        const messageList = {
            400: '请求参数错误',
            405: '请求服务方法错误',
            500: '服务器内部错误',
            403: '没有权限，请重新登陆'
        }

        if (respone) {
            const responseMessage = (respone.data || {}).message
            const errorMessage =
                responseMessage || messageList[respone.status] || defaultError

            if (respone.status === 403) {
                setTimeout(() => {}, 2000)
            }

            if (respone.status === 400) {
                Taro.showToast({
                    title: errorMessage,
                    icon: 'none',
                    duration: 2000
                })
            }
        } else {
            // Notification.error(defaultError)
        }
    }

    // 安装Token认证服务
    RequestService.installExtendService(new TokenService())
}
