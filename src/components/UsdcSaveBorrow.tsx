import React, { useState, useEffect } from "react";
import { AaveV3YieldService, YieldInfo } from "../services/AaveV3YieldService";
import usdcLogo from "../assets/usdc.png";

interface YieldAggr {
  bestSupplyYield: YieldInfo;
  bestBorrowYield: YieldInfo;
}

const UsdcSaveBorrow: React.FC = () => {
  const [usdcYields, setUsdcYields] = useState<YieldAggr | null>(null);
  //   const { data: cabBalance } = useReadCab();

  useEffect(() => {
    const aaveYieldService = new AaveV3YieldService();

    // Fetch USDC yields
    aaveYieldService.getBestYieldsForSymbol("USDC").then(setUsdcYields);
  }, []);

  const openModal = (
    actionType: "Supply" | "Borrow",
    tokenSymbol: string,
    tokenAddress: string,
    apy: number,
    chainName: string,
    chainId: number,
    marketAddress: string
  ) => {
    // Implement modal opening logic here
    console.log("Open modal", {
      actionType,
      tokenSymbol,
      tokenAddress,
      apy,
      chainName,
      chainId,
      marketAddress,
    });
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
          <button
            onClick={() =>  openModal(
                'Supply',
                'USDC',
                usdcYields.bestSupplyYield.tokenAddress,
                usdcYields.bestSupplyYield.supplyYield,
                usdcYields.bestSupplyYield.chainName,
                usdcYields.bestSupplyYield.chainId,
                usdcYields.bestSupplyYield.marketAddress
              )}
            className="w-full py-2 px-4 bg-blue-100 text-blue-600 rounded-md flex items-center justify-center hover:bg-blue-200 transition-colors"
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
        </div>
        {/* Borrow Section */}
        <div>
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
          <button
            onClick={() =>
              openModal(
                "Borrow",
                "USDC",
                usdcYields.bestBorrowYield.tokenAddress,
                usdcYields.bestBorrowYield.borrowYield,
                usdcYields.bestBorrowYield.chainName,
                usdcYields.bestBorrowYield.chainId,
                usdcYields.bestBorrowYield.marketAddress
              )
            }
            className="w-full py-2 px-4 bg-green-100 text-green-600 rounded-md flex items-center justify-center hover:bg-green-200 transition-colors"
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
        </div>
      </div>
    </div>
  );
};

export default UsdcSaveBorrow;
