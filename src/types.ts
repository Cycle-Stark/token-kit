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
    primaryColor: 'blue' | 'cyan' | 'dark' | 'grape' | 'gray' | 'green' | 'indigo' | 'lime' | 'orange' | 'pink' | 'red' | 'teal' | 'violet' | 'yellow'
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
