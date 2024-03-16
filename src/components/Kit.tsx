import { useEffect, useMemo, useState } from 'react';
import { Modal, Box, Group, Title, ActionIcon, Paper, Avatar, Stack, Text, ScrollArea, Pagination, Center, Anchor, Skeleton, Input, Image, Tooltip } from "@mantine/core"
import React from 'react';
import { CairoCustomEnum } from 'starknet';
import { IModalThemeObject, IToken } from '../types';
import { IconX } from '@tabler/icons-react';
import { useTokenKitContext } from '../providers/providerUtils';
import { formatNumberInternational, getRealPrice, limitChars, removeTrailingZeros } from '../configs/utils';
import { useDebouncedState, useDisclosure, useHover } from '@mantine/hooks';
import { db } from '../configs/db';
import { modals } from '@mantine/modals';
import { useLiveQuery } from 'dexie-react-hooks';

interface ISelectTokenModal {
    selectedToken: IToken | undefined
    children: React.ReactNode
    callBackFunc: (token: IToken) => void
    themeObject: IModalThemeObject
}

const SelectTokenModal = ({ children, selectedToken, callBackFunc, themeObject }: ISelectTokenModal) => {

    const { loadingTokens, network } = useTokenKitContext()

    const [opened, { open, close }] = useDisclosure(false);
    const [totalTokens, setTotalTokens] = useState(0)
    const [tokens, setTokens] = useState<IToken[]>([])
    const [commonTokens, setCommonTokens] = useState<IToken[]>([])

    const [searchedToken, setSearchedToken] = useDebouncedState('', 200);
    const [page, setPage] = useState(1)

    const have_tokens_changed = useLiveQuery(() => db.tokens.toArray())
    const tokensPerPage = 25

    const selectSingle = (token: IToken) => {
        callBackFunc && callBackFunc(token)
        close()
    }

    const loadCommonTokens = async () => {
        const common_tks = await db.tokens.filter((t: IToken) => (t.common ?? false) && (t.public ?? false)).toArray()
        setCommonTokens(common_tks)
    }

    const loadTokensFromDB = async () => {

        const _totalTokens = await db.tokens.count()
        setTotalTokens(_totalTokens)
        const limit = tokensPerPage;
        const offset = (page - 1) * tokensPerPage;
        const trimmedSearchedToken = searchedToken.trim()
        const regex = new RegExp(`(${trimmedSearchedToken})`, 'gi');

        const addressSearchTerm = removeTrailingZeros(trimmedSearchedToken)
        const addressRegex = new RegExp(`(${addressSearchTerm})`, 'gi');

        const filteredTokens = await db.tokens
            .filter((token: IToken) => {
                const matched =
                    token.symbol.match(regex) || token.name.match(regex) || removeTrailingZeros(token.address).match(addressRegex);
                return matched ? true : false;
            })
            .filter((token: IToken) => !!token.public)
            // .sortBy((token: IToken) => token.ver)
            .limit(limit)
            .offset(offset)
            .toArray();

        setTokens(filteredTokens);
    }


    const sortTokens = () => {
        return tokens.sort((a: IToken, b: IToken) => {
            // Custom comparator for sorting
            if (a.verified && a.common && !b.verified) {
                return -1; // a comes first if a is verified and common, and b is not verified
            } else if (a.verified && !a.common && !b.verified) {
                return -1; // a comes first if a is verified and not common, and b is not verified
            } else if (!a.verified && b.verified) {
                return 1; // b comes first if b is verified and a is not
            } else if (!a.verified && !b.verified) {
                // If both are not verified, sort by some other property (e.g., token.ver)
                return 1;
            } else {
                // If both are verified but have different common properties, prioritize the one with common
                return a.common ? -1 : 1;
            }
        });
    };


    const HEADER_HEIGHT = 250

    useEffect(() => {
        loadCommonTokens()
    }, [])

    useEffect(() => {
        loadTokensFromDB()
    }, [searchedToken, page, loadingTokens, have_tokens_changed])

    return (
        <div>
            <Box onClick={open}>
                {children}
            </Box>

            <Modal
                bg={themeObject.modalBackground}
                lockScroll
                c={themeObject.textColor}
                withinPortal={true}
                opened={opened}
                zIndex={100000}
                styles={{
                    header: {
                        width: '100%'
                    },
                    title: {
                        width: '100%'
                    }
                }}
                withCloseButton={false}
                size={'md'}
                onClose={() => {
                    close()
                    modals.closeAll()
                }}
                padding={0}
                radius="lg"
                title={null}>
                <Box style={{
                    height: '90dvh',
                    background: themeObject.modalBackground
                }}>
                    <Box h={`${HEADER_HEIGHT}px`} style={{
                        background: themeObject.headerFooterBackground
                    }}>
                        <Group p={'md'} justify='space-between' align='center' className='w-100'>
                            <Title order={2} fw={500}>Select Token</Title>
                            <Group>
                                <Box py={'6px'} px={'10px'} style={{
                                    background: themeObject.tokenHoverColor,
                                    borderRadius: '10px'
                                }}>
                                    <Text size='xs' c={themeObject.textColor}>
                                        {network === 'SN_GOERLI' ? 'Testnet' : null}
                                        {network === 'SN_MAIN' ? 'Mainnet' : null}
                                    </Text>
                                </Box>
                                <ActionIcon variant='transparent' onClick={close}>
                                    <IconX color={themeObject.textColor} />
                                </ActionIcon>
                            </Group>
                        </Group>
                        <Box px="md" h={`${HEADER_HEIGHT}px`}>
                            <Stack h={`${HEADER_HEIGHT}px`} gap={6}>
                                <Input type='search' defaultValue={searchedToken} onChange={e => setSearchedToken(e.target.value)}
                                    size='md' radius="lg"
                                    placeholder="Search name, symbol or paste address"
                                    className='w-100' mb="md"
                                    styles={{
                                        input: {
                                            border: `2px solid ${themeObject.searchBorderColor}`,
                                            background: themeObject.searchBackgroundColor,
                                            accentColor: 'red',
                                            '--_input-color': themeObject.searchTextColor
                                        },
                                    }} rightSectionPointerEvents='all'
                                />
                                <Group justify='space-between' align='center'>
                                    <Title order={5} mb="xs">Common tokens</Title>
                                </Group>
                                <Box style={{ overflow: 'hidden', maxWidth: '100%' }}>
                                    {
                                        commonTokens?.length === 0 ? <Text fw={500} ta={'center'} c={themeObject.textColor}>No common tokens.</Text> : null
                                    }
                                    <ScrollArea scrollbarSize={10} pb='10px' type="always">
                                        <Group display={'flex'} style={{ flexWrap: 'nowrap' }} p='6px' gap={10}>
                                            {
                                                commonTokens?.map((item, i) => (
                                                    <Box key={`token_s_${i}`} w={'fit-content'}>
                                                        <SelectTokenBtn token={item} select={selectSingle} selectedToken={selectedToken}
                                                            bgColor={themeObject.tokenBackgroundColor}
                                                            hoverColor={themeObject.tokenHoverColor} />
                                                    </Box>
                                                ))
                                            }
                                        </Group>
                                    </ScrollArea>
                                </Box>
                            </Stack>
                        </Box>
                    </Box>
                    <Box style={{
                        height: `calc(100% - ${HEADER_HEIGHT}px - 60px)`,
                        background: themeObject.modalBackground
                    }}>
                        <ScrollArea className='h-100'>
                            {
                                tokens?.length === 0 ? (
                                    <Box h={300}>
                                        <Center h={300}>
                                            <Text fw={500} ta={'center'} maw={'80%'} c={themeObject.textColor}>
                                                Tokens Not Found <Anchor href='https://tokenkit-gamma.vercel.app/' target='_blank'>list here.</Anchor>
                                            </Text>
                                        </Center>
                                    </Box>
                                ) : null
                            }
                            <Stack p="xs" gap={0}>
                                {
                                    sortTokens()?.map((item, i) => (
                                        <SelectToken key={`dfd_${i}`} token={item} select={selectSingle} selectedToken={selectedToken} bgColor={themeObject.tokenBackgroundColor}
                                            hoverColor={themeObject.tokenHoverColor} />
                                    ))
                                }
                            </Stack>
                        </ScrollArea>
                    </Box>
                    <Box px="md" style={theme => ({
                        height: `60px`,
                        background: themeObject.headerFooterBackground
                    })}>
                        <Group style={{ height: '100%' }} align='center' justify='space-between'>
                            <Anchor href='https://tokenkit-gamma.vercel.app/list-token' size='xs' fw={500} c={themeObject.textColor}>
                                List New Token
                            </Anchor>
                            <Pagination variant='light' value={page} radius={'md'} onChange={setPage} total={Math.ceil(totalTokens / tokensPerPage)} size={'sm'} />
                        </Group>
                    </Box>
                </Box>
            </Modal>
        </div>
    )
}


interface ISelectAsset {
    token: IToken
    select: any
    selectedToken?: IToken
    userAddress?: string
    bgColor?: string
    hoverColor?: string
}

const SelectToken = ({ token, select, selectedToken, bgColor, hoverColor }: ISelectAsset) => {
    const { pragma_contract } = useTokenKitContext()
    const [loading, setLoading] = useState(false)

    const [tokenPrice, setTokenPrice] = useState<null | any>(null)

    const { hovered, ref } = useHover();

    const getTokenPrice = async () => {
        // setTokenPrice(null)
        // if (pragma_contract && token?.pair_id !== '-' && token?.pair_id !== '' && token?.pair_id !== 'N/A') {
        //     const SPOTENTRY_ENUM = new CairoCustomEnum({
        //         SpotEntry: token?.pair_id
        //     })
        //     setLoading(true)
        //     try {
        //         const res = await pragma_contract.get_data_median(SPOTENTRY_ENUM)
        //         const price = getRealPrice(res)
        //         setTokenPrice(price)
        //         setLoading(false)
        //     } catch (error) {
        //         setLoading(false)
        //     }
        // }
    }

    const selectToken = () => {
        // This is to avoid selecting a token if it has no token price
        // if (tokenPrice) {
        // }
        select({ ...token, price: tokenPrice })
    }

    const getImageUrl = () => {
        if (token?.verified && token?.common) {
            return "https://i.postimg.cc/Qx8RZ8qD/verified.png"
        }
        else if (token?.verified && !token?.common) {
            return "https://i.postimg.cc/d3BpZpwg/casual-life-3d-check-mark-side-view-pink.png"
        }
        return null
    }

    const has_changed = useMemo(() => ({
        pragma_contract, selectedToken, token
    }), [pragma_contract, selectedToken, token])

    useEffect(() => {
        getTokenPrice()
    }, [has_changed])

    return (
        <Paper ref={ref} py={'xs'} radius={'md'} px="md" style={{
            background: hovered ? hoverColor : `${selectedToken?.address === token?.address ? hoverColor : 'transparent'}`,
            cursor: "pointer",
            pointerEvents: selectedToken?.address === token?.address ? "none" : "all",
        }} onClick={() => selectToken()}>
            <Group justify='space-between' align='center'>
                <Group align='center'>
                    <Avatar size="sm" src={token?.icon} variant='light' bg={bgColor} tt={'capitalize'}>
                        {limitChars(token?.symbol ?? '', 2, false)}
                    </Avatar>
                    <Stack gap={-10}>
                        <Group gap={3}>
                            <Text size="sm">{token?.symbol}</Text>
                            {
                                getImageUrl() ?
                                    <Tooltip label="This token is verified" position='bottom'>
                                        <Image src={getImageUrl()} h={'14px'} w="14px" />
                                    </Tooltip>
                                    : null
                            }
                        </Group>
                        <Text size="xs" fw={300}>{token?.name}</Text>
                    </Stack>
                </Group>
                {
                    loading ? <Skeleton height={10} width={40} /> : null
                }
                {
                    tokenPrice ? (
                        <Text size='xs' fw={300}>
                            ${formatNumberInternational(tokenPrice?.price)}
                        </Text>
                    ) : null
                }
            </Group>
        </Paper>
    )
}

const SelectTokenBtn = ({ token, select, selectedToken, bgColor, hoverColor }: ISelectAsset) => {
    const { pragma_contract } = useTokenKitContext()

    const [tokenPrice, setTokenPrice] = useState<null | any>(null)
    const [_loading, setLoading] = useState(false)

    const { hovered, ref } = useHover();

    const getTokenPrice = async () => {
        if (pragma_contract && token?.pair_id !== '-' && token?.pair_id !== '' && token?.pair_id !== 'N/A') {
            const SPOTENTRY_ENUM = new CairoCustomEnum({
                SpotEntry: token?.pair_id
            })
            setLoading(true)
            try {
                const res = await pragma_contract.get_data_median(SPOTENTRY_ENUM)
                const price = getRealPrice(res)
                setTokenPrice(price)
                setLoading(false)
            } catch (error) {
                setLoading(false)
            }
        }
    }

    const selectToken = () => {
        // Avoid selecting a token if no token price
        // if (tokenPrice) {
        // }
        select({ ...token, price: tokenPrice })
    }

    useEffect(() => {
        getTokenPrice()
    }, [pragma_contract, selectedToken])

    return (
        <Paper ref={ref} py={'4px'} px={'12px'} style={{
            background: hovered ? hoverColor : `${selectedToken?.address === token?.address ? hoverColor : "transparent"}`,
            border: `2px solid ${hoverColor}`,
            borderRadius: "10px",
            pointerEvents: selectedToken?.address === token?.address ? "none" : "all",
            cursor: "pointer",
            width: 'fit-content'
        }} onClick={() => selectToken()}>
            <Group gap={10} wrap='nowrap'>
                <Avatar size="sm" src={token?.icon} bg={bgColor} tt={'capitalize'}>
                    {limitChars(token?.symbol ?? '', 2, false)}
                </Avatar>
                <Text size="sm" fw={500}>{token?.symbol}</Text>
            </Group>
        </Paper>
    )
}

export default SelectTokenModal

