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
}

export interface ILoadTokenKit {
    children: ReactNode
    select: any
    token: IToken
}
