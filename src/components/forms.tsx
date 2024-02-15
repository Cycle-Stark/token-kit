import { Stack, Title, Grid, NumberInput, TextInput, Switch, Button, Loader } from "@mantine/core"
import { useForm } from "@mantine/form"
import { showNotification } from "@mantine/notifications"
import { IconCheck, IconAlertTriangle, IconWriting, IconUpload } from "@tabler/icons-react"
import React from "react"
import { useState } from "react"
import { useTokenKitContext } from "../providers/providerUtils"

interface IUpdateTokenForm {
    data: any
}

export const UpdateTokenForm = (props: IUpdateTokenForm) => {
    const { data } = props
    const { contract, reloadTokensFromContract } = useTokenKitContext()

    const [loading, setLoading] = useState(false)

    const form = useForm({
        initialValues: {
            token_index: data?.id ?? '',
            public: data?.public ?? false,
            verified: data?.verified ?? false,
            common: data?.common ?? false,
            icon_link: data?.icon ?? '',
            pair_id: data?.pair_id ?? '-',
        },
        validate: {
            icon_link: val => val === '' ? 'Icon link is required' : null
        }
    })

    const handleSubmit = () => {
        if (contract) {
            const call_data = form.values
            call_data.icon_link = form.values.icon_link
            const myCall = contract.populate('edit_token', call_data)

            contract.edit_token(myCall.calldata).then((_res: any) => {
                showNotification({
                    title: 'Update',
                    message: `Update Succesful`,
                    color: 'green',
                    icon: <IconCheck />
                })
                reloadTokensFromContract && reloadTokensFromContract()
            }).catch((err: any) => {
                showNotification({
                    title: 'Update failed',
                    message: `${err}`,
                    color: 'red',
                    icon: <IconAlertTriangle />
                })

            }).finally(() => {
                setLoading(false)
            })
        }
    }


    return (
        <form onSubmit={form.onSubmit(_values => handleSubmit())}>
            <Stack>
                <Title order={3}>Update Token</Title>
                <Grid>
                    <Grid.Col span={{ md: 12 }}>
                        <NumberInput disabled label="Token Index" placeholder="Token Index" radius={'md'} {...form.getInputProps('token_index')} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 12 }}>
                        <TextInput label="Pair ID" placeholder="ETH/USD" radius={'md'} {...form.getInputProps('pair_id')} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 4 }}>
                        <Switch label="Common" radius={'md'} {...form.getInputProps('common', { type: 'checkbox' })} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 4 }}>
                        <Switch label="Public" radius={'md'} {...form.getInputProps('public', { type: 'checkbox' })} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 4 }}>
                        <Switch label="Verified" radius={'md'} {...form.getInputProps('verified', { type: 'checkbox' })} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 12 }}>
                        <TextInput label="Icon Link" placeholder="https://shortlink/xysx" radius={'md'} {...form.getInputProps('icon_link')} maxLength={29} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 12 }}>
                        <Button radius={'md'} type="submit" leftSection={loading ? <Loader size="sm" color="white" /> : <IconWriting size={'18px'} />} rightSection={loading ? <Loader color="white" size={'sm'} /> : null}>Update Token</Button>
                    </Grid.Col>
                </Grid>
            </Stack>
        </form>
    )
}

export const ListTokenForm = () => {
    const [loading, setLoading] = useState(false)
    const { contract, reloadTokensFromContract } = useTokenKitContext()

    const form = useForm({
        initialValues: {
            address: '',
            icon_link: '',
            pair_id: '-',
        },
        validate: {
            address: val => val === '' ? 'Token Address is required' : null,
            icon_link: val => val === '' ? 'Icon link is required' : null
        }
    })

    const handleSubmit = () => {
        if (contract) {
            const call_data = form.values
            call_data.icon_link = form.values.icon_link
            const myCall = contract.populate('add_token', call_data)

            contract.add_token(myCall.calldata).then((_res: any) => {
                showNotification({
                    title: 'Token Listing',
                    message: `Token Added Succesfully`,
                    color: 'green',
                    icon: <IconCheck />
                })
                reloadTokensFromContract && reloadTokensFromContract()
            }).catch((err: any) => {
                showNotification({
                    title: 'Token listing failed',
                    message: `${err}`,
                    color: 'red',
                    icon: <IconAlertTriangle />
                })

            }).finally(() => {
                setLoading(false)
            })
        }
    }

    return (
        <form onSubmit={form.onSubmit(_values => handleSubmit())}>
            <Stack>
                <Title order={3}>List new Token</Title>
                <Grid>
                    <Grid.Col span={{ md: 12 }}>
                        <TextInput label="Token Address" placeholder="Token Address" radius={'md'} {...form.getInputProps('address')} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 12 }}>
                        <TextInput label="Pair ID" placeholder="ETH/USD" radius={'md'} {...form.getInputProps('pair_id')} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 12 }}>
                        <TextInput label="Icon Link" placeholder="https://shortlink/xysx" {...form.getInputProps('icon_link')} maxLength={29} radius={'md'} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 12 }}>
                        <Button radius={'md'} type="submit" leftSection={<IconUpload size={'18px'} />} rightSection={loading ? <Loader color="white" size={'sm'} /> : null}>List Token</Button>
                    </Grid.Col>
                </Grid>
            </Stack>
        </form>
    )
}


export const AddAdminForm = () => {
    const [loading, setLoading] = useState(false)
    const { contract } = useTokenKitContext()

    const form = useForm({
        initialValues: {
            address: '',
        },
        validate: {
            address: val => val === '' ? 'Admin Address is required' : null,
        }
    })

    const handleSubmit = () => {
        if (contract) {
            const call_data = form.values
            const myCall = contract.populate('add_admin', call_data)

            contract.add_admin(myCall.calldata).then((_res: any) => {
                showNotification({
                    title: 'New Admin',
                    message: `Admin Added Successfully`,
                    color: 'green',
                    icon: <IconCheck />
                })
            }).catch((err: any) => {
                showNotification({
                    title: 'Adding failed',
                    message: `${err}`,
                    color: 'red',
                    icon: <IconAlertTriangle />
                })

            }).finally(() => {
                setLoading(false)
            })
        }
    }

    return (
        <form onSubmit={form.onSubmit(_values => handleSubmit())}>
            <Stack>
                <Title order={3}>Add New Admin</Title>
                <Grid>
                    <Grid.Col span={{ md: 12 }}>
                        <TextInput label="Admin Address" placeholder="Admin Address" radius={'md'} {...form.getInputProps('address')} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 12 }}>
                        <Button radius={'md'} type="submit" leftSection={<IconUpload size={'18px'} />} rightSection={loading ? <Loader color="white" size={'sm'} /> : null}>Add Admin</Button>
                    </Grid.Col>
                </Grid>
            </Stack>
        </form>
    )
}


export const UpdateAdminForm = (props: { data: any }) => {
    const { data } = props
    const [loading, setLoading] = useState(false)
    const { contract } = useTokenKitContext()

    const form = useForm({
        initialValues: {
            address: data?.address ?? '',
            has_permission: data?.has_permission ?? false
        },
        validate: {
            address: val => val === '' ? 'Admin Address is required' : null,
        }
    })

    const handleSubmit = () => {
        if (contract) {
            const call_data = form.values
            const myCall = contract.populate('add_admin', call_data)

            contract.add_admin(myCall.calldata).then((_res: any) => {
                showNotification({
                    title: 'New Admin',
                    message: `Admin Updated Successfully`,
                    color: 'green',
                    icon: <IconCheck />
                })
            }).catch((err: any) => {
                showNotification({
                    title: 'Update failed',
                    message: `${err}`,
                    color: 'red',
                    icon: <IconAlertTriangle />
                })

            }).finally(() => {
                setLoading(false)
            })
        }
    }

    return (
        <form onSubmit={form.onSubmit(_values => handleSubmit())}>
            <Stack>
                <Title order={3}>Update Admin</Title>
                <Grid>
                    <Grid.Col span={{ md: 12 }}>
                        <TextInput label="Admin Address" disabled placeholder="Admin Address" radius={'md'} {...form.getInputProps('address')} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 4 }}>
                        <Switch label="Has Admin Permissions" radius={'md'} {...form.getInputProps('has_permission', { type: 'checkbox' })} />
                    </Grid.Col>
                    <Grid.Col span={{ md: 12 }}>
                        <Button radius={'md'} type="submit" leftSection={<IconUpload size={'18px'} />} rightSection={loading ? <Loader color="white" size={'sm'} /> : null}>Add Admin</Button>
                    </Grid.Col>
                </Grid>
            </Stack>
        </form>
    )
}
