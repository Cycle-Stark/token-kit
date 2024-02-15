import { useEffect, useMemo, useState } from 'react';
import { Modal, Box, Group, Title, ActionIcon, TextInput, Paper, Avatar, Stack, Text, ScrollArea, Pagination, Center, Anchor, Button, Skeleton, Input } from "@mantine/core"
import React from 'react';
import { CairoCustomEnum } from 'starknet';
import { IToken } from '../types';
import { IconReload, IconX } from '@tabler/icons-react';
import { useTokenKitContext } from '../providers/providerUtils';
import { formatNumberInternational, getRealPrice, removeTrailingZeros } from '../configs/utils';
import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import { db } from '../configs/db';
import { modals } from '@mantine/modals';
import { useLiveQuery } from 'dexie-react-hooks';

interface ISelectTokenModal {
    selectedToken: IToken | undefined
    children: React.ReactNode
    callBackFunc: (token: IToken) => void
    themeObject: {
        textColor: string
        modalBackground: string
        headerFooterBackground: string
        searchBorderColor: string
        searchBackgroundColor: string
        searchTextColor: string
        tokenBackgroundColor: string
        tokenHoverColor: string
    }
}

const SelectTokenModal = ({ children, selectedToken, callBackFunc, themeObject }: ISelectTokenModal) => {

    const { reloadTokensFromContract, loadingTokens } = useTokenKitContext()

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
        const common_tks = await db.tokens.filter((t: IToken) => (t.common ?? false) && (t.verified ?? false) && (t.public ?? false)).toArray()
        setCommonTokens(common_tks)
    }

    const loadTokensFromDB = async () => {

        const _totalTokens = await db.tokens.count()
        setTotalTokens(_totalTokens)
        const limit = tokensPerPage;
        const offset = (page - 1) * tokensPerPage;

        const regex = new RegExp(`(${searchedToken})`, 'gi');

        const addressSearchTerm = removeTrailingZeros(searchedToken)
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
                            <ActionIcon variant='light' onClick={close}>
                                <IconX />
                            </ActionIcon>
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
                                    }} rightSectionPointerEvents='all' rightSection={<ActionIcon onClick={() => setSearchedToken('')} variant='light'> <IconX color={themeObject.searchTextColor} /> </ActionIcon>} />
                                <Group justify='space-between' align='center'>
                                    <Title order={5} mb="xs">Common tokens</Title>
                                    <Button variant='light' onClick={reloadTokensFromContract} size='xs' radius={'md'} leftSection={<IconReload size={'16px'} />}>Refresh</Button>
                                </Group>
                                <Box style={{ overflow: 'hidden', maxWidth: '100%' }}>
                                    {
                                        commonTokens?.length === 0 ? <Text fw={500} ta={'center'} c={themeObject.textColor}>No listed common tokens.</Text> : null
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
                                                No tokens have been listed yet! be the first to list <Anchor href='https://tokenkit-gamma.vercel.app/' target='_blank'>here.</Anchor>
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
                            <Anchor href='https://tokenkit-gamma.vercel.app' size='sm'>
                                Add New
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

    const getTokenPrice = async () => {
        setTokenPrice(null)
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
        if (tokenPrice) {
            select({ ...token, price: tokenPrice })
        }
    }

    const has_changed = useMemo(() => ({
        pragma_contract, selectedToken, token
    }), [pragma_contract, selectedToken, token])

    useEffect(() => {
        getTokenPrice()
    }, [has_changed])

    return (
        <Paper py={'xs'} bg={selectedToken?.address === token?.address ? hoverColor : bgColor} radius={'md'} px="md" style={{
            backgroundColor: `${selectedToken?.address === token?.address ? hoverColor : bgColor} !important`,
            cursor: "pointer",
            pointerEvents: selectedToken?.address === token?.address ? "none" : "all",
        }} onClick={() => selectToken()}>
            <Group justify='space-between' align='center'>
                <Group align='center'>
                    <Avatar size="sm" src={token?.icon} variant='light' color='pink' />
                    <Stack gap={-10}>
                        <Text size="md"><b>{token?.symbol}</b></Text>
                        <Text size="sm" fw={400}>{token?.name}</Text>
                    </Stack>
                </Group>
                {
                    loading ? <Skeleton height={10} width={40} /> : null
                }
                {
                    tokenPrice ? (
                        <Text size='sm' fw={500}>
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
        if (tokenPrice) {
            select({ ...token, price: tokenPrice })
        }
    }

    useEffect(() => {
        getTokenPrice()
    }, [pragma_contract, selectedToken])
    return (
        <Paper bg={selectedToken?.address === token?.address ? hoverColor : bgColor} style={{
            background: `${selectedToken?.address === token?.address ? hoverColor : bgColor} !important`,
            border: "none",
            borderRadius: "10px",
            pointerEvents: selectedToken?.address === token?.address ? "none" : "all",
            padding: "4px 6px",
            cursor: "pointer",
            width: 'fit-content'
        }} onClick={() => selectToken()}>
            <Group gap={10} wrap='nowrap'>
                <Avatar size="sm" src={token?.icon} />
                <Text size="sm" fw={500}>{token?.symbol}</Text>
            </Group>
        </Paper>
    )
}

export default SelectTokenModal

