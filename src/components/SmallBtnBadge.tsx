import React from 'react'
import { Button } from '@mantine/core'

interface ISmallBtnBadge {
    label: string
    color: string
    width?: string
}
const SmallBtnBadge = (props: ISmallBtnBadge) => {
    const {color, label, width} = props

  return (
    <Button color={color} size='xs' radius={'xl'}style={{width: width ?? '80px'}}>{label}</Button>
  )
}

export default SmallBtnBadge