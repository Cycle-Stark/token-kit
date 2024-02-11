import { createContext, useContext } from "react"

const initialData = {
    contract: null as any,
    pragma_contract: null as any,
    account: null as any,
    address: null as any,
    connection: null as any,
    handleConnetDisconnectWalletBtnClick: null as any,
    openCloseModal: null as any,
    modalOpen: false,
    selectTokenFunc: null as any,
    selectedToken: null as any,
    reloadTokensFromContract: null as any,
    loadingTokens: false
}

export const TokenKitContext = createContext(initialData)

export const useTokenKitContext = () => {
    return useContext(TokenKitContext)
}