import { useAccount } from "wagmi";
import { useState } from "react";
import { Chip, Tooltip } from "@mui/material";
import { useReadCab, useEnableCab } from "@magic-account/wagmi";
import useAutoEnableCab from "../hooks/useAutoEnableCab";
import { formatUnits } from "viem";
import arbitrumIcon from "../assets/networks/arbitrum.svg";
import optimismIcon from "../assets/networks/optimism.svg";
import polygonIcon from "../assets/networks/polygon.svg";
import baseIcon from "../assets/networks/base.svg";
import TokenBalances from "./TokenBalances";

function Account() {
  const { address, isConnected } = useAccount();
  const { isEnabledOnCurrentChain } = useEnableCab();
  const { data: cabBalance } = useReadCab();
  const { isEnablingCab } = useAutoEnableCab();

  const [tooltipOpen, setTooltipOpen] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address || "");
    setTooltipOpen(true);
    setTimeout(() => setTooltipOpen(false), 1500);
  };

  const shortenAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  if (!isConnected) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 flex items-center justify-center h-64 md:mt-[70px] w-full">
        <p className="text-xl font-semibold text-gray-600">
          Connect to view account
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg md:mt-[70px] w-full">
      <div className="px-4 py-6 sm:px-6">
        <h3 className="text-xl font-semibold leading-7 text-gray-900">
          Magic Account
        </h3>
        {/* <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Your account details and balances.
        </p> */}
      </div>
      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:items-center bg-slate-100">
            <dt className="text-sm font-medium text-gray-900 sm:col-span-2">
              Address
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0 sm:text-right">
              <Tooltip open={tooltipOpen} title="Copied!" placement="top" arrow>
                <Chip
                  label={shortenAddress(address || "")}
                  onClick={copyAddress}
                  color="primary"
                  className="w-full justify-between"
                />
              </Tooltip>
            </dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:items-center">
            <dt className="text-sm font-medium text-gray-900 sm:col-span-2">
              Chain abstraction enabled
            </dt>
            <dd className="mt-1 text-sm leading-6 sm:col-span-1 sm:mt-0 sm:text-right">
              <span
                className={`font-semibold ${
                  isEnabledOnCurrentChain("USDC")
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {isEnablingCab
                  ? "Enabling..."
                  : isEnabledOnCurrentChain("USDC")
                    ? "Yes"
                    : "No"}
              </span>
            </dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:items-center bg-slate-100">
            <dt className="text-sm font-medium text-gray-900 sm:col-span-2">
              Supported Chains
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0 sm:text-right">
              <div className="flex -space-x-2 overflow-hidden justify-end">
                <img
                  src={arbitrumIcon}
                  alt="Arbitrum"
                  className="inline-block w-8 h-8 rounded-full ring-2 ring-white"
                />
                <img
                  src={optimismIcon}
                  alt="Optimism"
                  className="inline-block w-8 h-8 rounded-full ring-2 ring-white"
                />
                <img
                  src={polygonIcon}
                  alt="Polygon"
                  className="inline-block w-8 h-8 rounded-full ring-2 ring-white bg-white"
                />
                <img
                  src={baseIcon}
                  alt="Base"
                  className="inline-block w-8 h-8 rounded-full ring-2 ring-white"
                />
              </div>
            </dd>
          </div>
          <div className="px-4 py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:items-center">
            <dt className="text-sm font-medium text-gray-900 sm:col-span-2">
              Chain-abstracted balance (CAB)
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-1 sm:mt-0 sm:text-right">
              <span className="font-semibold">
                {cabBalance ? formatUnits(cabBalance, 6) : "0.00"} USDC
              </span>
            </dd>
          </div>
        </dl>
      </div>
      {isConnected && <TokenBalances />}
    </div>
  );
}

export default Account;
