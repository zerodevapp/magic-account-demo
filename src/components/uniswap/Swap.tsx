import { useState, useMemo } from "react";
import { ChevronDownIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import usdcLogo from "../../assets/usdc.png";
import { Token } from "@uniswap/sdk-core";
import { arbitrum } from "viem/chains";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";
import {
  tokenAddresses,
  tokenDecimals,
} from "../../services/uniswap/constants";
import { useReadCab } from "@magic-account/wagmi";
import TokenSelectModal from "./TokenSelectModal";
import { tokens as tokenData } from "../../utils/utils";
import { useTokenBalance } from "../../hooks/useTokenBalance";
import { useSwap } from "../../hooks/useSwap";
import { useUniswapQuote } from "../../hooks/useUniswapQuote";
import { toast } from "react-toastify";
import { useTokenBalancesForChains } from "../../hooks/useTokenBalancesForChains";
import { Button } from "@mui/material";
import ChainSelect from "../ChainSelect";

function Swap() {
  const [sellAmount, setSellAmount] = useState<string>("");
  const { address, chainId: isConnected } = useAccount();
  const [selectedChainId, setSelectedChainId] = useState(Number(arbitrum.id));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: cabBalance } = useReadCab();
  const [isTokenSelectOpen, setIsTokenSelectOpen] = useState(false);
  const [selectedToken, setSelectedToken] = useState("WETH");
  const { refetch: refetchBalances } = useTokenBalancesForChains(address);

  const {
    data: swapTokenBalance,
    isLoading: isBalanceLoading,
    error: balanceError,
    refetch: refetchBalance,
  } = useTokenBalance(
    selectedToken as keyof (typeof tokenAddresses)[keyof typeof tokenAddresses],
    selectedChainId
  );

  const { swap, isLoading } = useSwap({
    onSuccess: (userOpHash: string) => {
      toast.success(
        <div className="flex flex-col items-start space-y-2 text-sm">
          <span className="font-semibold text-green-600">Swap successful!</span>
          <div className="flex items-center space-x-2">
            <span>View details:</span>
            <a
              href={`https://jiffyscan.xyz/userOpHash/${userOpHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 text-xs font-medium text-blue-600 bg-blue-100 rounded-full hover:bg-blue-200 transition-colors duration-200"
            >
              Transaction Details
            </a>
          </div>
        </div>,
        {
          position: "bottom-right",
          autoClose: 15000,
        }
      );
      setSellAmount("");
      refetchBalance();
      refetchBalances();
    },
  });

  const tokens = useMemo(() => {
    const chainTokens =
      tokenAddresses[selectedChainId as keyof typeof tokenAddresses];
    return {
      USDC: new Token(selectedChainId, chainTokens.USDC, 6, "USDC", "USD Coin"),
      [selectedToken]: new Token(
        selectedChainId,
        chainTokens[selectedToken as keyof typeof chainTokens],
        tokenDecimals[selectedToken as keyof typeof tokenDecimals] || 18,
        selectedToken,
        selectedToken
      ),
    };
  }, [selectedChainId, selectedToken]);

  const { data: quoteAmount, isLoading: isQuoteLoading } = useUniswapQuote({
    sellAmount,
    tokenIn: tokens.USDC,
    tokenOut: tokens[selectedToken as keyof typeof tokens],
    fee: 500,
    chainId: selectedChainId,
  });

  const handleTokenSelect = (token: string) => {
    setSelectedToken(token);
  };

  const handleSwap = async () => {
    if (!address) {
      console.error("Wallet not connected");
      return;
    }

    try {
      await swap({
        sellToken: tokens.USDC,
        buyToken: tokens[selectedToken as keyof typeof tokens],
        sellAmount,
        selectedChainId,
      });
    } catch (error) {
      console.error("Swap failed", error);
      // Show an error message to the user
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const setNewChain = async (chainId: number) => {
    if (selectedToken === "WLD" && chainId !== 10) {
      setSelectedToken("WETH");
      setSellAmount("");
    }
    setSelectedChainId(chainId);
    toggleDropdown();
  };

  return (
    <div className="bg-white rounded-3xl shadow-lg p-4 w-full">
      <div className="flex justify-between items-center mb-4">
        <h2 className="bg-gradient-to-r from-orange-100 via-pink-100 to-purple-100 text-gray-700 rounded-md px-3 py-2 text-sm font-medium">
          Swap to any tokens on any chain
        </h2>
        <ChainSelect
          selectedChainId={selectedChainId}
          onChainSelect={setNewChain}
          className="w-56"
          excludeBase={true}
        />
      </div>

      <div className="space-y-4 relative">
        <div className="bg-gray-100 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Sell</span>
            <span className="text-sm text-gray-500">
              Balance: $
              {cabBalance
                ? Number(formatUnits(cabBalance, 6)).toFixed(2)
                : "0.00"}
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || parseFloat(value) >= 0) {
                  setSellAmount(value);
                }
              }}
              className="bg-transparent text-3xl font-semibold w-full outline-none border-none focus:border-none active:border-none focus:outline-none focus:ring-0"
              placeholder="0"
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
                appearance: "textfield",
                margin: 0,
                boxShadow: "none",
              }}
            />
            <button className="flex items-center bg-white rounded-2xl py-2 px-3 ml-2 hover:bg-gray-50">
              <img src={usdcLogo} alt="USDC" className="h-6 w-6 mr-2" />
              <span className="font-semibold">USDC</span>
              <ChevronDownIcon className="h-4 w-4 ml-2" />
            </button>
          </div>
          {sellAmount && (
            <div className="text-sm text-gray-500 mt-1">
              ${parseFloat(sellAmount).toFixed(2)}
            </div>
          )}
        </div>

        <div className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-5">
          <button className="bg-white p-2 rounded-full hover:bg-gray-100 shadow-md">
            <ArrowDownIcon className="h-6 w-6 text-blue-500" />
          </button>
        </div>
        <div className="bg-gray-100 rounded-2xl p-4 mt-1">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-500">Buy</span>
            <span className="text-sm text-gray-500">
              Balance:{" "}
              {isBalanceLoading
                ? "Loading..."
                : balanceError
                ? "Error fetching balance"
                : `${parseFloat(swapTokenBalance || "0").toFixed(
                    6
                  )} ${selectedToken}`}
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="number"
              value={quoteAmount ?? 0}
              readOnly
              className="bg-transparent text-3xl font-semibold w-full outline-none border-none focus:border-none active:border-none focus:outline-none focus:ring-0"
              placeholder={isQuoteLoading ? "Loading..." : "0"}
              style={{
                WebkitAppearance: "none",
                MozAppearance: "textfield",
                appearance: "textfield",
                margin: 0,
                boxShadow: "none",
              }}
            />
            <button
              className="flex items-center cursor-pointer bg-white rounded-2xl py-2 px-3 hover:bg-gray-200 w-44 justify-between"
              onClick={() => setIsTokenSelectOpen(true)}
            >
              <img
                src={
                  tokenData.find((token) => token.symbol === selectedToken)
                    ?.logo
                }
                alt={selectedToken}
                className="h-6 w-6 mr-2 rounded-full"
              />
              <span className="font-semibold">{selectedToken}</span>
              <ChevronDownIcon className="h-4 w-4 ml-2" />
            </button>
          </div>
          {/* {quoteAmount && (
            <div className="text-sm text-gray-500 mt-1">
              ${(parseFloat(quoteAmount) * 2450).toFixed(2)}
            </div>
          )} */}
        </div>
      </div>

      {/* {estimatedFeeData?.estimatedFee &&
        estimatedFeeData?.error !== true &&
        !isEstimatedFeeLoading && (
          <div className="text-sm text-gray-500 mt-2 text-right">
            Estimated fee:{" "}
            {parseFloat(estimatedFeeData.estimatedFee).toFixed(3) + " "}
            USDC
          </div>
        )} */}
      <Button
        variant="contained"
        sx={{ textTransform: "none", mt: 2, borderRadius: "1rem" }}
        fullWidth
        onClick={handleSwap}
        disabled={!isConnected || !sellAmount || isLoading}
      >
        {!isConnected
          ? "Connect Account"
          : isLoading
          ? "Swapping..."
          : sellAmount
          ? "Swap"
          : "Enter an amount"}
      </Button>
      <TokenSelectModal
        open={isTokenSelectOpen}
        onClose={() => setIsTokenSelectOpen(false)}
        onSelect={handleTokenSelect}
        selectedChainId={selectedChainId}
      />
    </div>
  );
}

export default Swap;
