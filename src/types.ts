import { ReactNode } from "react";

export interface IToken {
    address: string
    name: string
    symbol: string
    decimals: number
    icon: string
    verified?: boolean
    public?: boolean
    common?: boolean

    id?: number,
    pair_id?: string
    price?: any
}

export interface ITokenKitWrapper {
    children: ReactNode
    usingMantine: boolean
    theme: 'dark' | 'light'
    primaryColor: 'blue' | 'cyan' | 'dark' | 'grape' | 'gray' | 'green' | 'indigo' | 'lime' | 'orange' | 'pink' | 'red' | 'teal' | 'violet' | 'yellow',
    network: 'SN_MAIN' | 'SN_GOERLI'
    nodeUrl: string
}

export interface ILoadTokenKit {
    children: ReactNode
    select: any
    token: IToken
}

export interface TokensDBInfo {
    id: 1,
    name: string
    tokens_version: number
    tokens_count: number
}

export interface IModalThemeObject {
    textColor: string
    modalBackground: string
    headerFooterBackground: string
    searchBorderColor: string
    searchBackgroundColor: string
    searchTextColor: string
    tokenBackgroundColor: string
    tokenHoverColor: string
}