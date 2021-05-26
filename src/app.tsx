import './assets/styles/index.styl'
import 'taro-ui/dist/style/index.scss'
import 'windi.css'
import React from 'react'
import { Provider } from './store'
import { Router } from './router'

export default props => {
    return (
        <Provider>
            <Router>{props.children}</Router>
        </Provider>
    )
}
