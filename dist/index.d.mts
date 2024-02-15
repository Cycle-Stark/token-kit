import React, { ReactNode } from 'react';

interface IToken {
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    icon: string;
    verified?: boolean;
    public?: boolean;
    common?: boolean;
    id?: number;
    pair_id?: string;
    price?: any;
}
interface ITokenKitWrapper {
    children: ReactNode;
    usingMantine: boolean;
    theme: 'dark' | 'light';
    primaryColor: 'blue' | 'cyan' | 'dark' | 'grape' | 'gray' | 'green' | 'indigo' | 'lime' | 'orange' | 'pink' | 'red' | 'teal' | 'violet' | 'yellow';
}

declare const TokenKitWrapper: (props: ITokenKitWrapper) => React.JSX.Element;

declare const useTokenKitContext: () => {
    contract: any;
    pragma_contract: any;
    account: any;
    address: any;
    connection: any;
    handleConnetDisconnectWalletBtnClick: any;
    openCloseModal: any;
    modalOpen: boolean;
    selectTokenFunc: any;
    selectedToken: any;
    reloadTokensFromContract: any;
    loadingTokens: boolean;
};

interface ISelectTokenModal {
    selectedToken: IToken | undefined;
    children: React.ReactNode;
    callBackFunc: (token: IToken) => void;
    themeObject: {
        textColor: string;
        modalBackground: string;
        headerFooterBackground: string;
        searchBorderColor: string;
        searchBackgroundColor: string;
        searchTextColor: string;
        tokenBackgroundColor: string;
        tokenHoverColor: string;
    };
}
declare const SelectTokenModal: ({ children, selectedToken, callBackFunc, themeObject }: ISelectTokenModal) => React.JSX.Element;

declare const TokensTable: (props: any) => React.JSX.Element;

interface IUpdateTokenForm {
    data: any;
}
declare const UpdateTokenForm: (props: IUpdateTokenForm) => React.JSX.Element;
declare const ListTokenForm: () => React.JSX.Element;
declare const AddAdminForm: () => React.JSX.Element;
declare const UpdateAdminForm: (props: {
    data: any;
}) => React.JSX.Element;

declare function bigintToShortStr(bigintstr: string): string;
declare function bigintToLongAddress(bigintstr: string): string;
declare function convertToReadableTokens(tokens: any, decimals: number): string;
declare function limitChars(str: string, count: number, show_dots: boolean): string;

export { AddAdminForm, type IToken, ListTokenForm, SelectTokenModal, TokenKitWrapper, TokensTable, UpdateAdminForm, UpdateTokenForm, bigintToLongAddress, bigintToShortStr, convertToReadableTokens, limitChars, useTokenKitContext };
