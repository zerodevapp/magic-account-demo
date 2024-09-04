import { useState, useEffect, useMemo } from "react";
import { ChevronDownIcon, ArrowDownIcon } from "@heroicons/react/24/outline";
import usdcLogo from "../../assets/usdc.png";
import ethLogo from "../../assets/eth.svg";
import { Token } from "@uniswap/sdk-core";
import { getQuote } from "../../services/uniswap/QuoteService";
import { arbitrum } from "viem/chains";
import { formatUnits } from "viem";
import { useAccount, useSwitchChain } from "wagmi";
import { getTradeTransactions } from "../../services/uniswap/TradeService";
import { useSendCalls, useCallsStatus } from "wagmi/experimental";
import { chains, tokenAddresses } from "../../services/uniswap/constants";
import { Transition } from "@headlessui/react";
import { getChainIcon } from "../../utils/utils";
import { useReadCab } from "@magic-account/wagmi";
import { getWETHBalance } from "../../services/uniswap/BalanceService";

function Swap() {
  const [sellAmount, setSellAmount] = useState<string>("");
  const [buyAmount, setBuyAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { switchChainAsync } = useSwitchChain();
  const { address, chainId: currentChainId, isConnected } = useAccount();
  const { sendCallsAsync, data: id } = useSendCalls();
  const [selectedChainId, setSelectedChainId] = useState(Number(arbitrum.id));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: cabBalance } = useReadCab();
  const [wethBalance, setWethBalance] = useState<string>("0");
  const { data: callsStatus, refetch: refetchCallsStatus } = useCallsStatus({
    id: id as string,
    query: {
      enabled: !!id,
      refetchInterval: (data) =>
        data.state.data?.status === "CONFIRMED" ? false : 2000,
    },
  });

  useEffect(() => {
    async function fetchWETHBalance() {
      if (address && selectedChainId) {
        const balance = await getWETHBalance(address, selectedChainId);
        setWethBalance(balance);
      }
    }
    fetchWETHBalance();
  }, [address, selectedChainId]);

  const tokens = useMemo(() => {
    const chainTokens =
      tokenAddresses[selectedChainId as keyof typeof tokenAddresses];
    return {
      USDC: new Token(selectedChainId, chainTokens.USDC, 6, "USDC", "USD Coin"),
      WETH: new Token(
        selectedChainId,
        chainTokens.WETH,
        18,
        "WETH",
        "Wrapped Ether"
      ),
    };
  }, [selectedChainId]);

  useEffect(() => {
    if (callsStatus?.status === "CONFIRMED") {
      refetchCallsStatus();
      setIsLoading(false);
      // You might want to update balances or show a success message here
      console.log("Swap confirmed");
    }
  }, [callsStatus?.status, refetchCallsStatus]);

  const handleSwap = async () => {
    if (!address) {
      console.error("Wallet not connected");
      return;
    }

    setIsLoading(true);
    try {
      const transactions = await getTradeTransactions(
        tokens.USDC,
        tokens.WETH,
        sellAmount,
        address,
        selectedChainId
      );
      console.log({ transactions });
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
    } catch (error) {
      console.error("Swap failed", error);
      setIsLoading(false);
      // Show an error message to the user
    }
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const setNewChain = async (chainId: number) => {
    setSelectedChainId(chainId);
    toggleDropdown();
  };

  useEffect(() => {
    async function fetchQuote() {
      if (sellAmount) {
        try {
          const quote = await getQuote(
            sellAmount,
            tokens.USDC,
            tokens.WETH,
            500,
            selectedChainId!
          );
          console.log({ quote });
          setBuyAmount(quote);
        } catch (error) {
          console.error("Error fetching quote:", error);
          setBuyAmount("");
        }
      } else {
        setBuyAmount("");
      }
    }
    fetchQuote();
  }, [sellAmount, selectedChainId, tokens]);

  return (
    <div className="bg-white rounded-3xl shadow-lg p-4 w-[464px]">
      <div className="flex justify-between items-center mb-4">
        <h2 className="bg-gray-100 text-gray-700 rounded-md px-3 py-2 text-sm font-medium">
          Swap
        </h2>
        <div className="relative">
          <div
            onClick={toggleDropdown}
            className="flex items-center cursor-pointer bg-gray-100 rounded-2xl py-2 px-3 hover:bg-gray-200"
          >
            <img
              src={getChainIcon(selectedChainId) ?? ""}
              alt={chains[selectedChainId as keyof typeof chains].chain.name}
              className="h-5 w-5 mr-2"
            />
            <span className="font-semibold mr-2">
              {chains[selectedChainId as keyof typeof chains].chain.name}
            </span>
            <ChevronDownIcon className="h-4 w-4" />
          </div>

          <Transition
            show={isDropdownOpen}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                {Object.entries(chains).map(([chainId, chain]) => (
                  <div
                    key={chainId}
                    onClick={() => setNewChain(Number(chainId))}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer"
                  >
                    <img
                      src={getChainIcon(Number(chainId)) ?? ""}
                      alt={chain.chain.name}
                      className="h-5 w-5 mr-2"
                    />
                    {chain.chain.name}
                  </div>
                ))}
              </div>
            </div>
          </Transition>
        </div>
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
              onChange={(e) => setSellAmount(e.target.value)}
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
              Balance: {parseFloat(wethBalance).toFixed(4)} WETH
            </span>
          </div>
          <div className="flex items-center">
            <input
              type="number"
              value={buyAmount}
              readOnly
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
              <img src={ethLogo} alt="WETH" className="h-6 w-6 mr-2" />
              <span className="font-semibold">WETH</span>
              <ChevronDownIcon className="h-4 w-4 ml-2" />
            </button>
          </div>
          {buyAmount && (
            <div className="text-sm text-gray-500 mt-1">
              ${(parseFloat(buyAmount) * 2450).toFixed(2)}
            </div>
          )}
        </div>
      </div>

      <button
        className="w-full bg-blue-500 text-white font-semibold py-4 rounded-2xl mt-4 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
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
      </button>
    </div>
  );
}

export default Swap;
