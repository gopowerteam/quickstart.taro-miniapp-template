import './assets/styles/index.styl'
import 'taro-ui/dist/style/index.scss'
import 'windi.css'
// import Promise from 'promise-polyfill'
import React from 'react'
import { Provider } from './store'
import { Router } from './router'
import 'promise-prototype-finally'
// global.Promise = Promise

export default props => {
    return (
        <Provider>
            <Router>{props.children}</Router>
        </Provider>
    )
}
