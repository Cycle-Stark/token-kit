import React from 'react'

import { MantineProvider } from '@mantine/core';
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
    const { children, usingMantine, theme, primaryColor, network, nodeUrl } = props

    if (usingMantine) {
        return (
            <>
                <div className='tokenkit'>
                    <MantineProvider forceColorScheme={theme} theme={{
                        primaryColor: primaryColor
                    }}
                        // withCssVariables={true}
                        // cssVariablesSelector='.tokenkit'
                        // classNamesPrefix='tokenkit'
                        // getRootElement={() => document.querySelector<HTMLElement>('.tokenkit')!}
                    >
                        <TokenKitProvider nodeUrl={nodeUrl} network={network}>
                            {children}
                        </TokenKitProvider>
                    </MantineProvider>
                </div>
            </>
        )
    }
    return (
        <div className='tokenkit'>
            <MantineProvider forceColorScheme={theme} theme={{
                primaryColor: primaryColor
            }}
                // withCssVariables={true}
                // cssVariablesSelector='.tokenkit'
                // classNamesPrefix='tokenkit'
                // getRootElement={() => document.querySelector<HTMLElement>('.tokenkit')!}
            >
                <ModalsProvider>
                    <Notifications />
                    <TokenKitProvider nodeUrl={nodeUrl} network={network}>
                        {children}
                    </TokenKitProvider>
                </ModalsProvider>
            </MantineProvider>
        </div>
    )
}


export default TokenKitWrapper