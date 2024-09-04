import { createPublicClient, http, formatUnits, Address } from 'viem';
import { chains, tokenAddresses, tokenDecimals } from './constants';
import { erc20Abi } from 'viem';

export async function getTokenBalance(
    address: `0x${string}`,
    chainId: number,
    token: keyof typeof tokenAddresses[keyof typeof tokenAddresses]
): Promise<string> {
    const chain = chains[chainId as keyof typeof chains].chain;
    const tokenAddress = tokenAddresses[chainId as keyof typeof tokenAddresses][token] as Address;

    if (!address) {
        return '0';
    }
    if (!tokenAddress) {
        throw new Error(`Token ${token} not supported on chain ${chainId}`);
    }

    const publicClient = createPublicClient({
        chain,
        transport: http(),
    });

    try {
        const balance = await publicClient.readContract({
            address: tokenAddress,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [address],
        });

        const decimals = tokenDecimals[token];
        return formatUnits(balance, decimals);
    } catch (error) {
        console.error(`Error fetching ${token} balance:`, error);
        return '0';
    }
}