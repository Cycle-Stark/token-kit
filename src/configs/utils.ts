import { BigNumber } from 'bignumber.js'
import token_kit_abi from './../assets/token_kit_abi.json'
import { shortString } from 'starknet'


export const TOKEN_KIT_ABI = token_kit_abi
export const TOKEN_KIT_CONTRACT_ADDRESS = "0xa6715bb9e01d8e096f962569b9961e075c274e5ea65516de6c924d943681f9"

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