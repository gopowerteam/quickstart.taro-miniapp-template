import { Middleware, registerMiddlewares } from 'tarojs-router-next'

const LoginMiddleWare: Middleware = async (ctx, next) => {
    await next() // 执行下一个中间件
}

// 注册路由中间件
export function Router(props) {
    // 注册路由中间件
    registerMiddlewares([LoginMiddleWare])

    return <>{props.children}</>
}
