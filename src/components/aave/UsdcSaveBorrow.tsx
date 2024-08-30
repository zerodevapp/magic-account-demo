import React from "react";
import {
  YieldInfo,
} from "../../services/AaveV3YieldService";
import usdcLogo from "../../assets/usdc.png";
import { useSupplyBorrowModal } from "../../providers/SupplyBorrowModalProvider";
import { useReadCab } from "@magic-account/wagmi";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

interface YieldAggr {
  bestSupplyYield: YieldInfo;
  bestBorrowYield: YieldInfo;
}

interface UsdcSaveBorrowProps {
  usdcYields: YieldAggr;
}

const UsdcSaveBorrow: React.FC<UsdcSaveBorrowProps> = ({ usdcYields }) => {
  const { openModal } = useSupplyBorrowModal();
  const { isConnected } = useAccount();
  const { data: cabBalance } = useReadCab();

  const handleSaveClick = () => {
    if (usdcYields) {
      openModal({
        actionType: "Supply",
        tokenSymbol: "USDC",
        tokenAddress: usdcYields.bestSupplyYield.tokenAddress,
        apy: usdcYields.bestSupplyYield.supplyYield,
        chainName: usdcYields.bestSupplyYield.chainName,
        chainId: usdcYields.bestSupplyYield.chainId,
        marketAddress: usdcYields.bestSupplyYield.marketAddress,
        balances: {
          usdc: cabBalance ? formatUnits(cabBalance, 6) : "0.00",
          usdt: "0.00", // Replace with actual balance
        },
      });
    }
  };

  if (!usdcYields) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center mb-6">
        <img src={usdcLogo} alt="USDC Logo" className="w-10 h-10 mr-3" />
        <h2 className="text-2xl font-semibold">USDC Save/Borrow</h2>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* Supply Section */}
        <div>
          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 text-green-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-700">Savings rate</h3>
          </div>
          <p className="text-4xl font-bold text-green-600 mb-1">
            {(usdcYields.bestSupplyYield.supplyYield * 100).toFixed(2)}%
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {usdcYields.bestSupplyYield.chainName}
          </p>
          <div className="relative group">
            <button
              onClick={handleSaveClick}
              disabled={!isConnected}
              className="w-full py-2 px-4 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Save
            </button>
            {!isConnected && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Connect Account to save
              </div>
            )}
          </div>
        </div>
        {/* Borrow Section */}
        {/* <div>
          <div className="flex items-center mb-2">
            <svg
              className="w-5 h-5 text-indigo-500 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-700">Borrow rate</h3>
          </div>
          <p className="text-4xl font-bold text-indigo-600 mb-1">
            {(usdcYields.bestBorrowYield.borrowYield * 100).toFixed(2)}%
          </p>
          <p className="text-sm text-gray-500 mb-4">
            {usdcYields.bestBorrowYield.chainName}
          </p>
          <div className="relative group">
            <button
              onClick={() => alert("Borrow not implemented")}
              disabled={!isConnected}
              className="w-full py-2 px-4 bg-green-100 text-green-600 rounded-md flex items-center justify-center hover:bg-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Borrow
            </button>
            {!isConnected && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                Connect Account to borrow
              </div>
            )}
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default UsdcSaveBorrow;
