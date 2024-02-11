import React, { ReactNode, useEffect, useMemo, useState } from 'react'
import { Contract, RpcProvider } from 'starknet'
import { connect, disconnect } from 'starknetkit'
import { TOKEN_KIT_ABI, TOKEN_KIT_CONTRACT_ADDRESS, bigintToLongAddress, bigintToShortStr } from '../configs/utils'
import { modals } from '@mantine/modals'
import { Text } from '@mantine/core'
import { IToken } from '../types'
import BigNumber from 'bignumber.js'
import { db } from '../configs/db'
import { TokenKitContext } from './providerUtils'


interface IAppProvider {
    children: ReactNode
}

const TokenKitProvider = ({ children }: IAppProvider) => {

    const [contract, setContract] = useState<null | any>()
    const [pragma_contract, setPragmaContract] = useState<null | any>()
    const [connection, setConnection] = useState<null | any>();
    const [account, setAccount] = useState<null | any>();
    const [address, setAddress] = useState<null | any>("");
    const [modalOpen, setModalOpen] = useState(false)
    const [selectedToken, setselectedToken] = useState<IToken>()
    const [loading, setLoading] = useState(false)

    const connectWallet = async () => {
        let provider = new RpcProvider({ nodeUrl: 'https://starknet-goerli.infura.io/v3/958e1b411a40480eacb8c0f5d640a8ec' })
        const connection: any = await connect({
            webWalletUrl: "https://web.argent.xyz",
            dappName: "Token Kit",
            modalMode: "alwaysAsk",
            provider: provider
        });
        if (connection && connection?.wallet) {
            setConnection(connection);
            setAccount(connection?.wallet?.account);
            setAddress(connection?.wallet?.selectedAddress);
        }
    };

    const disconnectWallet = async () => {
        await disconnect({ clearLastWallet: true });
        setConnection(null);
        setAccount(null);
        setAddress("");
    };


    const openConfirmDisconnectModal = () => modals.openConfirmModal({
        title: 'Please confirm your action',
        centered: true,
        radius: "md",
        children: (
            <Text size="sm">
                Are you sure you want to disconnect your account?
            </Text>
        ),
        labels: { confirm: 'Disconnect', cancel: 'Cancel' },
        confirmProps: { radius: "md", variant: "light" },
        cancelProps: { radius: "md", variant: "light" },
        onCancel: () => { },
        onConfirm: () => disconnectWallet(),
    });


    const makeContractConnection = () => {
        let contract = new Contract(TOKEN_KIT_ABI, TOKEN_KIT_CONTRACT_ADDRESS)

        if (account) {
            contract = new Contract(TOKEN_KIT_ABI, TOKEN_KIT_CONTRACT_ADDRESS, account)
        }
        setContract(contract)
    }

    const handleConnetDisconnectWalletBtnClick = () => {
        if (!account) {
            connectWallet()
        }
        else {
            openConfirmDisconnectModal()
        }
    }

    const openCloseModal = (open: boolean) => {
        setModalOpen(open)
    }

    const selectTokenFunc = (token: IToken, func?: any) => {
        setselectedToken(token)
        func(token)
    }

    const loadTokens = async (page: number) => {
        try {
            const res = await contract.get_tokens(page);
            return res;
        } catch (error) {
            throw error; // Rethrow the error to handle it at a higher level if needed
        }
    };

    const formatToken = (token: any) => {
        const icon = bigintToShortStr(token?.icon)
        const formattedIcon = icon.startsWith('https://') || icon.startsWith('http://')
            ? icon // If it starts with 'https://' or 'http://', return as it is
            : `https://${icon}`;

        const formated_token: IToken = {
            address: bigintToLongAddress(token?.address),
            name: bigintToShortStr(token?.name),
            symbol: bigintToShortStr(token?.symbol),
            decimals: new BigNumber(token?.decimals).toNumber(),
            icon: formattedIcon,
            verified: token?.verified,
            public: token?.public,
            common: token?.common,
            pair_id: bigintToShortStr(token?.pair_id)
        }
        return formated_token
    }

    const actualLoadTokens = async (noOfTokens: number) => {
        setLoading(true)
        // Calculate the number of pages based on 25 items per page
        const totalPages = Math.ceil(noOfTokens / 25);

        // Use Promise.all to parallelize fetching token data for all pages
        const allTokens = await Promise.all(
            Array.from({ length: totalPages }, (_, index) => loadTokens(index + 1))
        );

        // Combine the arrays of tokens from different pages if needed
        const combinedTokens = allTokens.flat().map((token: IToken, i: number) => {
            const formated_token = formatToken(token)
            return ({
                id: i + 1,
                ...formated_token
            })
        });

        db.tokens.bulkPut(combinedTokens,).then((res: any) => {
            console.log("Tokens saved the items successfully")
        }).catch((error: any) => {
            console.log("Error: ", error)
        })
        setLoading(false)
    }

    const getContractTokensInfo = async () => {
        try {
            if (contract) {
                const totalTokens = await contract.get_tokens_count();
                const noOfTokens = new BigNumber(totalTokens).toNumber();
                const dbTokensCount = await db.tokens.count()

                if (dbTokensCount !== noOfTokens) {
                    actualLoadTokens(noOfTokens)
                }


            }
        } catch (error) {
            console.error("Error fetching contract tokens information:", error);
        }
    };

    const reloadTokensFromContract = async () => {
        try {
            if (contract) {
                const totalTokens = await contract.get_tokens_count();
                const noOfTokens = new BigNumber(totalTokens).toNumber();
                actualLoadTokens(noOfTokens)
                // window.location.reload()
            }
        } catch (error) {
            console.error("Error fetching contract tokens information:", error);
        }
    }

    const contextValue = useMemo(() => ({
        contract,
        pragma_contract,
        account,
        address,
        connection,
        handleConnetDisconnectWalletBtnClick,
        modalOpen,
        openCloseModal,
        selectTokenFunc,
        selectedToken,
        reloadTokensFromContract,
        loadingTokens: loading
    }), [account, contract, address, pragma_contract, modalOpen]);

    useEffect(() => {
        makeContractConnection()
    }, [account])

    useEffect(() => {
        getContractTokensInfo()
    }, [contract])

    useEffect(() => {
        connectWallet()
    }, [])

    return (
        <TokenKitContext.Provider value={contextValue}>
            {children}
        </TokenKitContext.Provider>
    )
}

export default TokenKitProvider
