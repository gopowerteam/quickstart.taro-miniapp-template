const dev = require('../env.development.json')

module.exports = {
    env: {
        NODE_ENV: '"development"',
        ...dev
    },
    defineConstants: {},
    mini: {},
    h5: {
        esnextModules: ['taro-ui']
    }
}
