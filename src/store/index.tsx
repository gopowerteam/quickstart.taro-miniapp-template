import React from 'react'
import { AppStoreProvider } from './app.store'
import { DeptStoreProvider } from './dept.store'
import { UserStoreProvider } from './user.store'

const providers: any[] = [
    AppStoreProvider,
    UserStoreProvider,
    DeptStoreProvider
]

const ProvidersComposer = props =>
    props.providers.reduceRight(
        (children, Parent) => <Parent>{children}</Parent>,
        props.children
    )

export const Provider = props => (
    <ProvidersComposer providers={providers}>
        {props.children}
    </ProvidersComposer>
)
