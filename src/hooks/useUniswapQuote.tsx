import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { Token } from '@uniswap/sdk-core';
import { getQuote } from '../services/uniswap/QuoteService';
import debounce from 'lodash/debounce';

interface UseUniswapQuoteParams {
  sellAmount: string;
  tokenIn: Token;
  tokenOut: Token;
  fee: number;
  chainId: number;
}

export function useUniswapQuote({
  sellAmount,
  tokenIn,
  tokenOut,
  fee,
  chainId,
}: UseUniswapQuoteParams) {
  const [debouncedSellAmount, setDebouncedSellAmount] = useState(sellAmount);

  useEffect(() => {
    const debouncedSetSellAmount = debounce(setDebouncedSellAmount, 500);
    debouncedSetSellAmount(sellAmount);
    return () => debouncedSetSellAmount.cancel();
  }, [sellAmount]);

  return useQuery({
    queryKey: ['uniswapQuote', debouncedSellAmount, tokenIn.address, tokenOut.address, fee, chainId],
    queryFn: () => getQuote(debouncedSellAmount, tokenIn, tokenOut, fee, chainId),
    enabled: !!debouncedSellAmount && parseFloat(debouncedSellAmount) > 0,
  });
}