import { Token } from '@uniswap/sdk-core';
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/QuoterV2.sol/QuoterV2.json';
import { fromReadableAmount, toReadableAmount } from '../../utils/conversion';
import { Address } from 'viem';
import { getPublicClient, chains } from './constants';

export async function getQuote(
    amountIn: string,
    tokenIn: Token,
    tokenOut: Token,
    fee: number,
    chainId: number
): Promise<string> {
    const publicClient = getPublicClient(chainId);
    const amountInConverted = fromReadableAmount(amountIn, tokenIn.decimals)

    const quoterResult = await publicClient.readContract({
        address: chains[chainId as keyof typeof chains].quoterAddress as Address,
        abi: Quoter.abi,
        functionName: 'quoteExactInputSingle',
        args: [{
            tokenIn: tokenIn.address,
            tokenOut: tokenOut.address,
            fee: fee,
            amountIn: amountInConverted,
            sqrtPriceLimitX96: 0n
        }],
    }) as [bigint, bigint, number, bigint];
    const [amountOut, , , ] = quoterResult;

    return toReadableAmount(amountOut, tokenOut.decimals);
}
