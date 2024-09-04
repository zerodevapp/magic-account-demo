import { arbitrum, base, polygon, optimism } from 'viem/chains';
import { createPublicClient, http } from 'viem';
export const chains = {
    [arbitrum.id]: {
        chain: arbitrum,
        poolFactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        quoterAddress: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
        swapRouterAddress01: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        swapRouterAddress02: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    },
    [base.id]: {
        chain: base,
        poolFactoryAddress: '0x33128a8fC17869897dcE68Ed026d694621f6FDfD',
        quoterAddress: '0x3d4e44Eb1374240CE5F1B871ab261CD16335B76a',
        swapRouterAddress02: '0x2626664c2603336E57B271c5C0b26F421741e481',
        swapRouterAddress01: '',
    },
    [polygon.id]: {
        chain: polygon,
        poolFactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        quoterAddress: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
        swapRouterAddress01: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        swapRouterAddress02: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    },
    [optimism.id]: {
        chain: optimism,
        poolFactoryAddress: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        quoterAddress: '0x61fFE014bA17989E743c5F6cB21bF9697530B21e',
        swapRouterAddress01: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        swapRouterAddress02: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
    },
}

export const tokenAddresses = {
    [arbitrum.id]: {
        USDC: '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
        WETH: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    },
    [base.id]: {
        USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        WETH: '0x4200000000000000000000000000000000000006',
    },
    [polygon.id]: {
        USDC: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
        WETH: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    },
    [optimism.id]: {
        USDC: '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85',
        WETH: '0x4200000000000000000000000000000000000006',
    },
};

export function getPublicClient(chainId: number) {
    if (!Object.keys(chains).includes(chainId?.toString())) {
        throw new Error('Chain not supported')
    }
    return createPublicClient({
        chain: chains[chainId as keyof typeof chains].chain,
        transport: http(),
    })
}