import './assets/styles/index.styl'
import 'taro-ui/dist/style/index.scss'
import 'windi.css'
import React from 'react'
import { Provider } from './store'
import { Router } from './router'
import { BootStrap } from './bootstrap'

export default props => {
    return (
        <Provider>
            <Router>
                <BootStrap>{props.children}</BootStrap>
            </Router>
        </Provider>
    )
}
