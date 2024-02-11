import React from 'react'

import { MantineProvider } from '@mantine/core';
import { ITokenKitWrapper } from './types';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';

import TokenKitProvider from './providers/tokenkitprovider';

import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/carousel/styles.css';

import '@mantine/core/styles.layer.css';
import 'mantine-datatable/styles.layer.css';
import './styles/layout.css'

const TokenKitWrapper = (props: ITokenKitWrapper) => {
    const { children, usingMantine } = props
    if (usingMantine) {
        return (
            <TokenKitProvider>
                {children}
            </TokenKitProvider>
        )
    }
    return (
        <MantineProvider theme={{
            primaryColor: 'pink'
        }}>
            <ModalsProvider>
                <Notifications />
                <TokenKitProvider>
                    {children}
                </TokenKitProvider>
            </ModalsProvider>
        </MantineProvider>
    )
}


export default TokenKitWrapper