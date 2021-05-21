module.exports = {
    gateway: 'http://gateway.local.xbt-dev.top',
    apiVersion: 'v2',
    controllerDir: {
        alias: '../../controller',
        path: './src/http/controller'
    },
    serviceDir: {
        alias: '@/http/services',
        path: './src/http/services'
    },
    services: {
        'dingtalk-service': 'xbt-platform-dingtalk-service',
        'salary-service': 'xbt-platform-salary-service',
        'kyb-service': 'xbt-platform-kyb-service',
        'file-service': 'xbt-platform-file-service'
    }
}
