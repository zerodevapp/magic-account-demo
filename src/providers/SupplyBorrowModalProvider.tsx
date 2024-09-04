/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { createContext, useState, useContext, useEffect } from "react";
import Modal from "../components/Modal";
import SupplyBorrowModal from "../components/aave/UsdcSaveModal";
import { useSendCalls, useCallsStatus } from "wagmi/experimental";
import {
  AaveSupplyEncodeService,
  RawTransaction,
} from "../services/AaveSupplyService";
import { useAccount, useSwitchChain } from "wagmi";
import { parseUnits } from "viem";

interface SupplyBorrowModalContextType {
  isOpen: boolean;
  openModal: (props: SupplyBorrowModalProps) => void;
  closeModal: () => void;
  refreshSavings: () => void;
}

interface SupplyBorrowModalProps {
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

const SupplyBorrowModalContext = createContext<
  SupplyBorrowModalContextType | undefined
>(undefined);

export const SupplyBorrowModalProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [transferPending, setTransferPending] = useState(false);
  const { address, chainId: currentChainId } = useAccount();
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState<SupplyBorrowModalProps | null>(
    null
  );
  const { sendCallsAsync, data: id } = useSendCalls();
  const { data: callsStatus, refetch: refetchCallsStatus } = useCallsStatus({
    id: id as string,
    query: {
      enabled: !!id,
      // Poll every 2 seconds until the calls are confirmed
      refetchInterval: (data) =>
        data.state.data?.status === "CONFIRMED" ? false : 2000,
    },
  });
  const status = callsStatus?.status;
  const [, setRefreshTrigger] = useState(0);
  const refreshSavings = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    if (status === "CONFIRMED") {
      refetchCallsStatus();
      setTransferPending(false);
      setRefreshTrigger(prev => prev + 1); 
      // notifications.show({
      //   color: "green",
      //   message: "Successfully transfer 0.01 ETH to your eoa",
      // });
    }
  }, [status, refetchCallsStatus]);
  const aaveSupplyEncodeService = new AaveSupplyEncodeService();
  const { switchChainAsync } = useSwitchChain();

  const openModal = (props: SupplyBorrowModalProps) => {
    setModalProps(props);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalProps(null);
  };

  const handleSubmit = async (data: any) => {
    if (!address) return;
    setTransferPending(true);
    try {
      const amountString = String(data.amount);
      const amount = parseUnits(amountString, 6);
      if (!amount) {
        console.error("Error: Amount input field is empty");
        return;
      }

      const encodedTxs = aaveSupplyEncodeService.encodeSupplyTxs(
        data.tokenAddress as `0x${string}`,
        data.chainId,
        amount,
        address
      );

      if (currentChainId !== data.chainId) {
        await switchChainAsync({ chainId: data.chainId });
      }

      const calls = encodedTxs.map((tx: RawTransaction) => ({
        to: tx.to,
        value: tx.value || BigInt(0),
        data: tx.data || "0x",
      }));

      const result = await sendCallsAsync({
        calls,
      });

      closeModal();
      console.log("Transaction posted:", result);
      // You can add a success modal or notification here
    } catch (e: any) {
      closeModal();
      console.error("Error:", e);
      setTransferPending(false);
      // You can add an error modal or notification here
    }
  };

  return (
    <SupplyBorrowModalContext.Provider
      value={{ isOpen, openModal, closeModal, refreshSavings }}
    >
      {children}
      <Modal open={isOpen} handleClose={closeModal} showPoweredBy={false}>
        {modalProps && (
          <SupplyBorrowModal
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
            transferPending={transferPending}
          />
        )}
      </Modal>
    </SupplyBorrowModalContext.Provider>
  );
};

export const useSupplyBorrowModal = () => {
  const context = useContext(SupplyBorrowModalContext);
  if (context === undefined) {
    throw new Error(
      "useSupplyBorrowModal must be used within a SupplyBorrowModalProvider"
    );
  }
  return context;
};
