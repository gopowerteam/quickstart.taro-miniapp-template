import './assets/styles/index.styl'
import 'windi.css'
import React from 'react'
import { Provider } from './store'
import { Router } from './router'
import { BootStrap } from './boostrap'

export default props => {
    return (
        <Provider>
            <Router>
                <BootStrap>{props.children}</BootStrap>
            </Router>
        </Provider>
    )
}
