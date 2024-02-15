import { BigNumber } from 'bignumber.js'
import token_kit_abi from './../assets/token_kit_abi.json'
import { shortString } from 'starknet'

import pragma_abi from './../assets/pragmaabi.json'


export const TOKEN_KIT_ABI = token_kit_abi
export const TOKEN_KIT_CONTRACT_ADDRESS = "0x72fccd711f5a27e50b48d56514717847b45ab3620a517cd9cad61ded3b5895d"

export const PRAGMA_ABI = pragma_abi
export const PRAGMA_CONTRACT_ADDRESS = "0x06df335982dddce41008e4c03f2546fa27276567b5274c7d0c1262f3c2b5d167"	

export function isDarkMode(colorscheme: any): boolean {
    return colorscheme === 'dark' ? true : false
}

export function formatNumberInternational(number: number) {
    const DECIMALS = 4
    if (typeof Intl.NumberFormat === 'function') {
        const formatter = new Intl.NumberFormat('en-US', { minimumFractionDigits: DECIMALS, maximumFractionDigits: DECIMALS });
        return formatter.format(number);
    } else {
        console.warn('Intl.NumberFormat is not supported in this browser. Fallback may not provide accurate formatting.');
        return number.toLocaleString('en-US');
    }
}

export function bigintToShortStr(bigintstr: string) {
    try {
        if (!bigintstr) return ""
        const bn = BigNumber(bigintstr)
        const hex_sentence = `0x` + bn.toString(16)
        return shortString.decodeShortString(hex_sentence)
    }
    catch (error) {
        return bigintstr
    }
}

export function bigintToLongAddress(bigintstr: string) {
    try {
        if (!bigintstr) return ""
        const bn = BigNumber(bigintstr)
        const hex_sentence = `0x` + bn.toString(16)
        return hex_sentence;
    }
    catch (error) {
        return bigintstr
    }
}

export function convertToReadableTokens(tokens: any, decimals: number) {
    if (!tokens || !decimals) return ""
    return new BigNumber(tokens).dividedBy(10 ** decimals).toNumber().toFixed(6)
}

export const removeTrailingZeros = (tokenAddress: string): string => {
    if (tokenAddress.length > 4) {
        const res = '0x' + tokenAddress.substring(2).replace(/^0+/, "");
        return res
    }
    return tokenAddress
};

export function limitChars(str: string, count: number, show_dots: boolean) {
    if (count <= str?.length) {
        return `${str.substring(0, count)} ${show_dots ? '...' : ''}`
    }
    return str
}


export function timeStampToDate(timestamp: number) {
    if (!timestamp) return null
    const timestampInMilliseconds = timestamp * 1000;
    const date = new Date(timestampInMilliseconds);
    return date;
}

export function getRealPrice(val: any) {
    let decimals = BigNumber(val.decimals).toNumber()
    let ts = BigNumber(val.last_updated_timestamp).toNumber()
    let real_price = {
        price: BigNumber(val.price).dividedBy(10 ** decimals).toNumber(),
        last_updated_timestamp: timeStampToDate(ts),
        num_sources_aggregated: BigNumber(val.num_sources_aggregated).toNumber()
    }
    return real_price
}
