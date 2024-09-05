import React, { useState, useMemo } from "react";
import { useTokenBalancesForChains } from "../hooks/useTokenBalancesForChains";
import { chains } from "../services/uniswap/constants";
import { useAccount } from "wagmi";
import { tokens } from "../utils/utils";

const TokenBalances: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState<string>(tokens[0].symbol);
  const { address } = useAccount();

  const {
    data: balances,
    isLoading,
    error,
  } = useTokenBalancesForChains(address!);

  const tokenTotals = useMemo(() => {
    if (!balances) return {};
    return tokens.reduce((acc, { symbol }) => {
      acc[symbol] = Object.values(balances).reduce(
        (sum, chainBalances) => sum + (chainBalances[symbol] || 0),
        0
      );
      return acc;
    }, {} as Record<string, number>);
  }, [balances]);
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto w-full">
      <h2 className="text-2xl font-bold mb-4 text-center">Token Balances</h2>
      <div className="mb-4">
        <select
          className="w-full p-2 border rounded-md"
          value={selectedToken}
          onChange={(e) => setSelectedToken(e.target.value)}
        >
          {tokens.map(({ symbol }) => (
            <option key={symbol} value={symbol}>
              {symbol}{" "}
              {isLoading
                ? "(Loading...)"
                : `(${tokenTotals[symbol]?.toFixed(6) || "0.000000"})`}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between font-semibold text-gray-600">
          <span>Chain</span>
          <span>Amount</span>
        </div>
        {isLoading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error fetching balances</div>
        ) : (
          Object.entries(chains).map(([chainId, { chain }]) => (
            <ChainBalance
              key={chainId}
              chainName={chain.name}
              balance={balances?.[Number(chainId)]?.[selectedToken] || 0}
            />
          ))
        )}
      </div>
    </div>
  );
};

const ChainBalance: React.FC<{ chainName: string; balance: number }> = ({
  chainName,
  balance,
}) => {
  return (
    <div className="flex items-center justify-between">
      <span>{chainName}</span>
      <span className="font-mono">{balance.toFixed(6)}</span>
    </div>
  );
};

export default TokenBalances;
