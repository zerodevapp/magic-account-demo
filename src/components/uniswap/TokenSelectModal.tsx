import React from "react";
import Modal from "../Modal";
import { tokens } from "../../utils/utils";

interface TokenSelectModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (token: string) => void;
}

const TokenSelectModal: React.FC<TokenSelectModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  return (
    <Modal open={open} handleClose={onClose} showPoweredBy={false}>
      <h2 className="text-xl font-semibold mb-4">Select a token</h2>
      <div className="grid grid-cols-2 gap-4">
        {tokens
          .filter((token) => token.symbol !== "USDC")
          .map((token) => (
            <button
              key={token.symbol}
              className="flex items-center justify-start p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
              onClick={() => {
                onSelect(token.symbol);
                onClose();
              }}
            >
              <img
                src={token.logo}
                alt={token.symbol}
                className="w-8 h-8 mr-3 rounded-full"
              />
              <span className="font-medium">{token.symbol}</span>
            </button>
          ))}
      </div>
    </Modal>
  );
};

export default TokenSelectModal;
