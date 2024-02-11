import { useDebouncedState, useDisclosure } from '@mantine/hooks';
import React, { useEffect, useState } from 'react'
import { db } from '../configs/db';
import { limitChars, removeTrailingZeros } from '../configs/utils';
import { IToken } from '../types';
// import { DataTable } from 'mantine-datatable';
import { ActionIcon, Avatar, Box, Button, Drawer, Grid, Group, Select, Stack, Text, TextInput, em } from '@mantine/core';
import CustomCopyBtn from './CustomCopyButton';
import { IconCheck, IconFilter, IconReload, IconWriting, IconX } from '@tabler/icons-react';
import { UpdateTokenForm } from './forms';
import { useTokenKitContext } from '../providers/providerUtils';
import { useForm } from '@mantine/form';

interface ITokensTable {
    DataTable: React.ReactNode
}

const TokensTable = (props: any) => {
    const { reloadTokensFromContract, loadingTokens } = useTokenKitContext()

    const { DataTable } = props
    const [tokens, setTokens] = useState<IToken[]>([])
    const [token, setToken] = useState<IToken>()
    const [opened, { open, close }] = useDisclosure(false)

    // const [searchedToken, setSearchedToken] = useDebouncedState('', 500);
    const [totalTokens, setTotalTokens] = useState<number>(0)
    const [page, setPage] = useState(1)

    const tokensPerPage = 25

    const filterForm = useForm({
        initialValues: {
            searchedToken: '',
            common: 'all',
            public: 'all',
            verified: 'all',
        }
    })

    // const filterTokens = () => {
    //     const filteredTokens = tokens?.filter((token: IToken) => {
    //         const regex = new RegExp(filterForm.values.searchedToken, 'gi');
    //         return token.symbol.match(regex) || token.name.match(regex) || token.address.match(regex)
    //     })
    //     return filteredTokens
    // }

    const loadTokensFromDB = async () => {
        const tot_tokens = await db.tokens.count()
        setTotalTokens(tot_tokens)
        const limit = tokensPerPage;
        const offset = (page - 1) * tokensPerPage;

        const searchTermTrimmedZeroes = removeTrailingZeros(filterForm.values.searchedToken)
        // const regexString = `(${searchTermTrimmedZeroes})`;
        // const regex = new RegExp(regexString, 'gi');
        const regexString = searchTermTrimmedZeroes.split('').join('[\\w\\s]*');
        const regex = new RegExp(`(${regexString}[\\w\\s]*)`, 'gi');
        const filteredTokens = await db.tokens
            .filter((token: IToken) => {
                const matched =
                    token.symbol.match(regex) || token.name.match(regex) || removeTrailingZeros(token.address).match(regex);
                return matched ? true : false;
            })
            .filter((token: IToken) => {
                const common = filterForm.values.common
                if (common === 'true') {
                    return token.common === true
                }
                else if (common === 'false') {
                    return token.common === false
                }
                return true
            })
            .filter((token: IToken) => {
                const verified = filterForm.values.verified
                if (verified === 'true') {
                    return token.verified === true
                }
                else if (verified === 'false') {
                    return token.verified === false
                }
                return true
            })
            .filter((token: IToken) => {
                const _public = filterForm.values.public
                if (_public === 'true') {
                    return token.public === true
                }
                else if (_public === 'false') {
                    return token.public === false
                }
                return true
            })
            .limit(limit)
            .offset(offset)
            .toArray();

        setTokens(filteredTokens);
    }

    const updateTokenModal = (token: IToken) => {
        setToken(token)
        open()
    }

    const reloadTokens = () => {
        reloadTokensFromContract && reloadTokensFromContract()
        loadTokensFromDB()
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


    useEffect(() => {
        loadTokensFromDB()
    }, [page, loadingTokens])

    return (
        <Stack>
            <Box>
                <form onSubmit={filterForm.onSubmit(_values => loadTokensFromDB())}>
                    <Grid>
                        <Grid.Col span={{ md: 3 }}>
                            <TextInput label="Search Token" placeholder='Search by name, symbol or address' radius={'md'} {...filterForm.getInputProps('searchedToken')} />
                        </Grid.Col>
                        <Grid.Col span={{ md: 2 }}>
                            <Select label="Common" radius={'md'} placeholder="True/False" data={[
                                { value: 'all', label: 'All' },
                                { value: 'true', label: 'True' },
                                { value: 'false', label: 'False' },
                            ]} {...filterForm.getInputProps('common')} />
                        </Grid.Col>
                        <Grid.Col span={{ md: 2 }}>
                            <Select label="Verified" radius={'md'} placeholder="True/False" data={[
                                { value: 'all', label: 'All' },
                                { value: 'true', label: 'True' },
                                { value: 'false', label: 'False' },
                            ]} {...filterForm.getInputProps('verified')} />
                        </Grid.Col>
                        <Grid.Col span={{ md: 2 }}>
                            <Select label="Public" radius={'md'} placeholder="True/False" data={[
                                { value: 'all', label: 'All' },
                                { value: 'true', label: 'True' },
                                { value: 'false', label: 'False' },
                            ]} {...filterForm.getInputProps('public')} />
                        </Grid.Col>
                        <Grid.Col span={{ md: 3 }}>
                            <Group h={'100%'} justify="start" align='end'>
                                <Button radius={'md'} type='submit' size='xs' leftSection={<IconFilter size={'16px'} />}>Filter</Button>
                                <Button color='indigo' size='xs' onClick={reloadTokens} radius={'md'} leftSection={<IconReload size={'16px'} />}>Refresh</Button>
                            </Group>
                        </Grid.Col>
                    </Grid>
                </form>
            </Box>
            <Drawer opened={opened} onClose={close} title={`Updating ${token?.name}`} position='right' size={'sm'}>
                <UpdateTokenForm data={token} />
            </Drawer>
            <DataTable
                withTableBorder
                minHeight={300}
                verticalSpacing={'md'}
                horizontalSpacing={'md'}
                borderRadius={'lg'}
                records={sortTokens() ?? []}
                columns={[
                    {
                        accessor: 'id',
                        title: 'ID',
                        width: '100px',
                        render: (item: IToken) => (
                            <Text size='sm'>{item.id}</Text>
                        )
                    },
                    {
                        accessor: 'name',
                        title: 'Name',
                        width: '250px',
                        render: (item: IToken) => (
                            <Group align='center' gap={'sm'}>
                                <Avatar src={item.icon} size={'md'} radius={'md'} tt={'uppercase'}>
                                    {limitChars(item.name, 2, false)}
                                </Avatar>
                                <Text size='sm'>{item.name}</Text>
                            </Group>
                        )
                    },
                    {
                        accessor: 'symbol',
                        title: 'Symbol',
                        width: '200px',
                        render: (item: IToken) => (
                            <Text size='sm'>{item.symbol}</Text>
                        )
                    },
                    {
                        accessor: 'address',
                        title: 'Token Address',
                        width: '300px',
                        render: (item: IToken) => (
                            <Group gap={10} wrap='nowrap'>
                                <CustomCopyBtn color={'green'} copy_value={item.address} />
                                <Text size='sm'>{limitChars(item.address, 20, true)}</Text>
                            </Group>
                        )
                    },
                    {
                        accessor: 'decimals',
                        title: 'Decimals',
                        width: '100px',
                        textAlign: 'center',
                        render: (item: IToken) => (
                            <Text size='sm' ta={'center'} fw={500}>{item.decimals}</Text>
                        )
                    },
                    {
                        accessor: 'pair_id',
                        title: 'Pair ID (Pragma ID)',
                        width: '200px',
                        textAlign: 'center',
                        render: (item: IToken) => (
                            <Text size='sm'>{item.pair_id}</Text>
                        )
                    },
                    {
                        accessor: 'common',
                        title: 'Common',
                        width: '150px',
                        textAlign: 'center',
                        render: (item: IToken, i: number) => (
                            <Group justify='center'>
                                {item.common ? <IconCheck color='green' stroke={em(1.5)} /> : <IconX color='red' stroke={em(1.5)} />}
                            </Group>
                        )
                    },
                    {
                        accessor: 'verified',
                        title: 'Verified',
                        width: '150px',
                        textAlign: 'center',
                        render: (item: IToken, i: number) => (
                            <Group justify='center'>
                                {item.verified ? <IconCheck color='green' stroke={em(1.5)} /> : <IconX color='red' stroke={em(1.5)} />}
                            </Group>
                        )
                    },
                    {
                        accessor: 'public',
                        title: 'Public',
                        width: '150px',
                        textAlign: 'center',
                        render: (item: IToken, i: number) => (
                            <Group justify='center'>
                                {item.public ? <IconCheck color='green' stroke={em(1.5)} /> : <IconX color='red' stroke={em(1.5)} />}
                            </Group>
                        )
                    },
                    {
                        accessor: 'actions',
                        title: 'Actions',
                        width: '150px',
                        textAlign: 'center',
                        render: (item: IToken, i: number) => (
                            <Group justify='center'>
                                <ActionIcon onClick={() => updateTokenModal(item)}>
                                    <IconWriting />
                                </ActionIcon>
                            </Group>
                        )
                    },
                ]}
                // onRowClick={(row: any) =>
                //     updateTokenModal(row?.record)
                // }
                page={page}
                onPageChange={setPage}
                totalRecords={totalTokens}
                recordsPerPage={25}
            />
        </Stack>
    )
}

export default TokensTable