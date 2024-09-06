import React from "react";
import Modal from "../Modal";
import { tokens } from "../../utils/utils";
import Tooltip from "@mui/material/Tooltip";

interface TokenSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (token: string) => void;
  selectedChainId: number;
}

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  open,
  onClose,
  onSelect,
  selectedChainId,
}) => {
  return (
    <Modal open={open} handleClose={onClose} showPoweredBy={false}>
      <h2 className="text-xl font-semibold mb-4">Select a token</h2>
      <div className="grid grid-cols-2 gap-4">
        {tokens
          .filter((token) => token.symbol !== "USDC")
          .map((token) => {
            const isWLDDisabled =
              token.symbol === "WLD" && selectedChainId !== 10;
            return (
              <Tooltip
                key={token.symbol}
                title={isWLDDisabled ? "WLD is only available on Optimism" : ""}
                arrow
              >
                <div>
                  <button
                    className={`flex items-center justify-start p-3 rounded-xl transition-colors w-full ${
                      isWLDDisabled
                        ? "bg-gray-200 cursor-not-allowed opacity-50"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                    onClick={() => {
                      if (!isWLDDisabled) {
                        onSelect(token.symbol);
                        onClose();
                      }
                    }}
                    disabled={isWLDDisabled}
                  >
                    <img
                      src={token.logo}
                      alt={token.symbol}
                      className="w-8 h-8 mr-3 rounded-full"
                    />
                    <span className="font-medium">{token.symbol}</span>
                  </button>
                </div>
              </Tooltip>
            );
          })}
      </div>
    </Modal>
  );
};

export default TokenSelectModal;
