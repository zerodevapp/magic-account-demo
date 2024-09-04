import { createPublicClient, http, formatUnits, Address } from 'viem';
import { chains, tokenAddresses } from './constants';
import { erc20Abi } from 'viem';

export async function getWETHBalance(address: `0x${string}`, chainId: number): Promise<string> {
  const chain = chains[chainId as keyof typeof chains].chain;
  const wethAddress = tokenAddresses[chainId as keyof typeof tokenAddresses].WETH as Address;

  const publicClient = createPublicClient({
    chain,
    transport: http(),
  });

  try {
    const balance = await publicClient.readContract({
      address: wethAddress,
      abi: erc20Abi,
      functionName: 'balanceOf',
      args: [address],
    });

    return formatUnits(balance, 18); // WETH has 18 decimals
  } catch (error) {
    console.error('Error fetching WETH balance:', error);
    return '0';
  }
}