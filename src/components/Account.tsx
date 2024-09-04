import { useAccount } from "wagmi";
import { useState } from "react";
import { Chip, Tooltip } from "@mui/material";
import { useReadCab, useEnableCab } from "@magic-account/wagmi";
import useAutoEnableCab from "../hooks/useAutoEnableCab";
import { formatUnits } from "viem";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import arbitrumIcon from "../assets/networks/arbitrum.svg";
import optimismIcon from "../assets/networks/optimism.svg";
import polygonIcon from "../assets/networks/polygon.svg";
import baseIcon from "../assets/networks/base.svg";

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
    <div className="bg-white shadow-md rounded-lg p-6 md:mt-[70px] w-full">
      <h2 className="text-2xl font-bold mb-4">Magic Account Details</h2>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600">Address</label>
        <div className="mt-1">
          <Tooltip open={tooltipOpen} title="Copied!" placement="top" arrow>
            <Chip
              label={shortenAddress(address || "")}
              onClick={copyAddress}
              icon={<ContentCopyIcon />}
              variant="outlined"
              className="w-full justify-between"
            />
          </Tooltip>
        </div>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600">CAB Enabled</label>
        <p
          className={`mt-1 font-semibold ${
            isEnabledOnCurrentChain("USDC") ? "text-green-600" : "text-red-600"
          }`}
        >
          {isEnablingCab
            ? "Enabling..."
            : isEnabledOnCurrentChain("USDC")
            ? "Yes"
            : "No"}
        </p>
      </div>

      <div className="mb-4">
        <label className="text-sm font-medium text-gray-600">
          Supported Chains
        </label>
        <div className="flex space-x-2 mt-1">
          <img src={arbitrumIcon} alt="Arbitrum" className="w-8 h-8" />
          <img src={optimismIcon} alt="Optimism" className="w-8 h-8" />
          <img src={polygonIcon} alt="Polygon" className="w-8 h-8" />
          <img src={baseIcon} alt="Base" className="w-8 h-8" />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-600">
          CAB Balance (USDC)
        </label>
        <p className="mt-1 text-lg font-semibold">
          ${cabBalance ? formatUnits(cabBalance, 6) : "0.00"}
        </p>
      </div>
    </div>
  );
}

export default Account;
