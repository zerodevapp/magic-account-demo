/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useContext } from "react";
import Modal from "../components/Modal";
import UsdcSaveModal from "../components/aave/UsdcSaveModal";
import { useAccount } from "wagmi";
import { useAaveSupply } from "../hooks/useAaveSupply";
import { useAavePositions } from "../hooks/useAavePositions";
import { useReadCab } from "@zerodev/magic-account";
import { toast } from "react-toastify";

interface SupplyModalContextType {
  isOpen: boolean;
  openModal: (props: SupplyModalProps) => void;
  closeModal: () => void;
}

interface SupplyModalProps {
  actionType: "Supply" | "Borrow";
  tokenSymbol: string;
  tokenAddress: string;
  apy: number;
  chainName: string;
  chainId: number;
  marketAddress: string;
  balances: {
    usdc: string;
    usdt: string;
  };
}

const SupplyModalContext = createContext<SupplyModalContextType | undefined>(
  undefined
);

export function SupplyModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { address } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState<SupplyModalProps | null>(null);

  const { refetch: refetchPositions } = useAavePositions();
  const { refetch: refetchCab } = useReadCab();
  const { supply, isLoading } = useAaveSupply({
    onSuccess: (userOpHash: string) => {
      setTimeout(() => {
        refetchPositions();
        refetchCab();
      }, 500);
      closeModal();
      toast.success(
        <div className="flex flex-col items-start space-y-2 text-sm">
          <span className="font-semibold text-green-600">
            Supply successful!
          </span>
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
    },
  });

  const openModal = (props: SupplyModalProps) => {
    setModalProps(props);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalProps(null);
  };

  const handleSubmit = async (data: any) => {
    if (!address) return;
    supply({
      tokenAddress: data.tokenAddress,
      chainId: data.chainId,
      amount: data.amount.toString(),
    });
  };

  return (
    <SupplyModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
      <Modal open={isOpen} handleClose={closeModal} showPoweredBy={false}>
        {modalProps && (
          <UsdcSaveModal
            isVisible={isOpen}
            tokenSymbol={modalProps.tokenSymbol}
            tokenAddress={modalProps.tokenAddress}
            apy={modalProps.apy}
            chainName={modalProps.chainName}
            chainId={modalProps.chainId}
            marketAddress={modalProps.marketAddress}
            balances={modalProps.balances}
            onClose={closeModal}
            onSubmit={handleSubmit}
            transferPending={isLoading}
          />
        )}
      </Modal>
    </SupplyModalContext.Provider>
  );
}

export const useSupplyModal = () => {
  const context = useContext(SupplyModalContext);
  if (context === undefined) {
    throw new Error("useSupplyModal must be used within a SupplyModalProvider");
  }
  return context;
};
