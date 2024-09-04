import React, { useState, useEffect } from "react";
import { formatUnits, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { chainNameFromId, getChainIcon } from "../../utils/utils";
import { AaveGetSuppliesService } from "../../services/AaveGetSuppliesService";
import { useSupplyBorrowModal } from "../../providers/SupplyBorrowModalProvider";

type Position = {
  token: string;
  chainId: number;
  amount: string;
};

const MySavings: React.FC = () => {
  const { address } = useAccount();
  const [positions, setPositions] = useState<Position[]>([]);
  const [totals, setTotals] = useState({ usdc: "0" });
  const { refreshSavings } = useSupplyBorrowModal();

  useEffect(() => {
    const fetchPositions = async () => {
      if (address) {
        const aaveGetSuppliesService = new AaveGetSuppliesService();
        const fetchedPositions =
          await aaveGetSuppliesService.getSuppliedPositions(address);
        const formattedPositions = fetchedPositions.map((position) => ({
          ...position,
          amount: formatUnits(BigInt(position.amount), 6),
        }));
        setPositions(formattedPositions);
        calculateTotals(formattedPositions);
      }
    };
    fetchPositions();
  }, [address, refreshSavings]);

  const calculateTotals = (positions: Position[]) => {
    const totalUSDC = positions
      .filter((x) => x.token === "USDC")
      .reduce((acc, curr) => acc + parseUnits(curr.amount, 6), BigInt(0));
    setTotals({
      usdc: formatUnits(totalUSDC, 6),
    });
  };

  const withdrawAll = async () => {
    if (!address) return;
    alert("Withdraw all not implemented");
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const openWithdraw = async (_position: Position) => {
    if (!address) return;
    alert("Withdraw not implemented");
  };

  const parseNumber = (num: string) => parseFloat(num).toFixed(2);

  return (
    <div className="col-span-2 shadow-md rounded-3xl">
      <div className="col-span-1">
        <div className="px-8 py-5 bg-white min-h-24 flex flex-col justify-center border border-slate-100 rounded-3xl col-span-1">
          <div className="font-semibold w-full flex flex-row items-center justify-between">
            <div className="flex flex-row items-center gap-x-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-8 h-8"
              >
                <path d="M19 5c-1.5 0-2.8 1.4-3 2-3.5-1.5-11-.3-11 5 0 1.8 0 3 2 4.5V20h4v-2h3v2h4v-4c1-.5 1.7-1 2-2h2v-4h-2c0-1-.5-1.5-1-2V5z" />
                <path d="M2 9v1c0 1.1.9 2 2 2h1" />
                <path d="M16 11h.01" />
              </svg>
              My savings
            </div>
            <div className="flex flex-row gap-x-2">
              <div className="flex flex-row items-center border-slate-100 pr-4 pl-4 border-l w-44">
                <img className="h-8 mr-2" src="/assets/usdc.png" alt="" />
                <div className="flex flex-col">
                  <div className="text-sm font-medium text-slate-500">USDC</div>
                  <div className="-mt-1">{parseNumber(totals.usdc)}</div>
                </div>
              </div>
              <button
                onClick={withdrawAll}
                className="py-2 w-48 border-r hover:bg-slate-50 flex flex-row items-center justify-center gap-x-2 transition-all border-slate-100 text-sm font-semibold px-4"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 17V3" />
                  <path d="m6 11 6 6 6-6" />
                  <path d="M19 21H5" />
                </svg>
                Withdraw all
              </button>
            </div>
          </div>
          <div className="w-full pt-4 border-slate-100 mt-4 border-t flex flex-col">
            <div className="w-full grid grid-cols-4">
              <div className="text-sm text-slate-500">Asset</div>
              <div className="text-sm text-slate-500">Pool</div>
              <div className="text-sm text-slate-500">Supplied amount</div>
              <div></div>
            </div>
            {positions.map((pos, index) => (
              <div
                key={index}
                className="w-full grid grid-cols-4 py-2 items-center"
              >
                <div className="flex flex-row gap-x-2 items-center">
                  <img
                    className="h-6"
                    src={`/assets/${pos.token.toLowerCase()}.png`}
                    alt=""
                  />
                  <div className="mt-[0.15rem] h-8 flex font-light flex-row items-center">
                    {pos.token}
                  </div>
                </div>
                <div className="text-sm h-full flex flex-row gap-x-2 items-center">
                  <img
                    className="h-4"
                    src={getChainIcon(pos.chainId)}
                    alt={chainNameFromId(pos.chainId)}
                  />
                  {chainNameFromId(pos.chainId)}
                </div>
                <div>{parseNumber(pos.amount)}</div>
                <div>
                  <button
                    onClick={() => openWithdraw(pos)}
                    className="py-2 w-full hover:bg-slate-50 transition-all border-slate-200 text-sm font-semibold px-8 rounded-md border"
                  >
                    Withdraw
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MySavings;
