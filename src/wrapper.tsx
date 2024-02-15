import React from 'react'

import { MantineProvider, useMantineTheme } from '@mantine/core';
import { ITokenKitWrapper } from './types';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import TokenKitProvider from './providers/tokenkitprovider';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import './styles/layout.css'

const TokenKitWrapper = (props: ITokenKitWrapper) => {
    const { children, usingMantine, theme, primaryColor } = props

    if (usingMantine) {
        return (
            <>
                <TokenKitProvider>
                    {children}
                </TokenKitProvider>
            </>
        )
    }
    return (
        <MantineProvider forceColorScheme={theme} theme={{
            primaryColor: primaryColor
        }} withCssVariables={true} cssVariablesSelector='.tokenkit' classNamesPrefix='tokenkit'>
            <div className='tokenkit'>
                <ModalsProvider>
                    <Notifications />
                    <TokenKitProvider>
                        {children}
                    </TokenKitProvider>
                </ModalsProvider>
            </div>
        </MantineProvider>
    )
}


export default TokenKitWrapper