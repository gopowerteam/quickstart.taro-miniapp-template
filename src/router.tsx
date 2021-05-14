import { Middleware, registerMiddlewares } from 'tarojs-router-next'

const LoginMiddleWare: Middleware = async (ctx, next) => {
    console.log('第三个中间件执行：', ctx.route.url)
    await next() // 执行下一个中间件
    console.log('第三个中间件执行结束')
}

// 注册路由中间件
export function Router(props) {
    // 注册路由中间件
    registerMiddlewares([LoginMiddleWare])

    return <>{props.children}</>
}
