import { useMutation } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { useSendCalls, useCallsStatus } from "wagmi/experimental";
import { getTradeTransactions } from "../services/uniswap/TradeService";
import { Token } from "@uniswap/sdk-core";

interface UseSwapParams {
  onSuccess: () => void;
}

export function useSwap({ onSuccess }: UseSwapParams) {
  const { address, chainId: currentChainId } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { sendCallsAsync, data: id } = useSendCalls();
  const [isTransitioning, setIsTransitioning] = useState(false);

  const mutation = useMutation({
    mutationFn: async ({
      sellToken,
      buyToken,
      sellAmount,
      selectedChainId,
    }: {
      sellToken: Token;
      buyToken: Token;
      sellAmount: string;
      selectedChainId: number;
    }) => {
      if (!address) {
        throw new Error("Wallet not connected");
      }

      setIsTransitioning(true);

      const transactions = await getTradeTransactions(
        sellToken,
        buyToken,
        sellAmount,
        address,
        selectedChainId
      );

      const calls = transactions.map((tx) => ({
        to: tx.to as `0x${string}`,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value: BigInt((tx as any).value ?? 0),
        data: tx.data as `0x${string}`,
      }));

      if (currentChainId !== selectedChainId) {
        await switchChainAsync({ chainId: selectedChainId });
      }

      const result = await sendCallsAsync({ calls });
      console.log("Swap transaction posted:", result);
      return result;
    },
    onError: (error) => {
      console.error("Swap failed", error);
      setIsTransitioning(false);
    },
  });

  const { data: callStatusData, refetch: refetchCallStatus } = useCallsStatus({
    id: id as string,
    query: {
      enabled: !!id,
      refetchInterval: (data) =>
        data.state.data?.status === "CONFIRMED" ? false : 1000,
    },
  });

  useEffect(() => {
    if (callStatusData?.status === "CONFIRMED" && isTransitioning && !mutation.isPending) {
      refetchCallStatus();
      setIsTransitioning(false);
      onSuccess?.();
    }
  }, [callStatusData?.status, onSuccess, refetchCallStatus]);

  return {
    swap: mutation.mutate,
    isLoading: mutation.isPending || isTransitioning,
    error: mutation.error,
    callStatus: callStatusData?.status,
    isCallStatusLoading: callStatusData?.status === "PENDING",
  };
}
