import { useState, useEffect, useCallback } from "react";
import Modal from "../Modal";
import { useReadCab, useEstimateFeesCab } from "@zerodev/magic-account";
import { formatUnits, isAddress } from "viem";
import ChainSelect from "../ChainSelect";
import { arbitrum } from "viem/chains";
import { erc20Abi, encodeFunctionData, parseUnits } from "viem";
import { useSendErc20Token } from "../../hooks/useSendErc20Token";
import debounce from "lodash/debounce";
import {
  tokenAddresses,
  tokenDecimals,
} from "../../services/uniswap/constants";
import { Button, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";

interface SendModalProps {
  open: boolean;
  onClose: () => void;
}

function SendModal({ open, onClose }: SendModalProps) {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const { data: cabBalance } = useReadCab({ refetchInterval: 1000 });
  const [selectedChainId, setSelectedChainId] = useState<number>(arbitrum.id);
  const { address } = useAccount();
  const [isValidAddress, setIsValidAddress] = useState<boolean | null>(null);
  const { estimateFees } = useEstimateFeesCab();
  const [maxAmount, setMaxAmount] = useState<string | null>(null);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [feeEstimate, setFeeEstimate] = useState<string | null>(null);
  const [isLoadingEstimateFees, setIsLoadingEstimateFees] = useState(false);
  const [baseFeeEstimate, setBaseFeeEstimate] = useState<number | null>(null);

  // Validate recipient address with debounce
  const validateAddress = useCallback(
    debounce((address: string) => {
      setIsValidAddress(address ? isAddress(address) : null);
    }, 300),
    []
  );

  useEffect(() => {
    validateAddress(recipient);
  }, [recipient, validateAddress]);

  // Estimate base fee when modal opens or chain changes
  const estimateBaseFee = useCallback(async () => {
    if (!selectedChainId) return;

    try {
      const tokenAddress = tokenAddresses[
        selectedChainId as keyof typeof tokenAddresses
      ]?.USDC as `0x${string}`;

      if (!tokenAddress) {
        console.error("USDC address not found for the selected chain");
        setBaseFeeEstimate(null);
        return;
      }

      const minimalTransferAmount = "0.000001"; // Minimal amount for base fee estimation
      const transferCall = {
        to: tokenAddress,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [
            address as `0x${string}`,
            parseUnits(minimalTransferAmount, tokenDecimals.USDC),
          ],
        }),
        value: 0n,
      };

      setIsLoadingEstimateFees(true);
      const result = await estimateFees({
        calls: [transferCall],
        repayTokens: [],
        chainId: selectedChainId,
      });
      setIsLoadingEstimateFees(false);

      if (result.error) {
        setBaseFeeEstimate(null);
        console.error("Error estimating base fees:", result.error);
        return;
      }

      const baseFee = Number(result.estimatedFee);
      const feeBuffer = 1.03;
      const estimatedBaseFee = baseFee * feeBuffer;
      setBaseFeeEstimate(estimatedBaseFee);

      // Calculate maxAmount
      if (cabBalance) {
        const balance = Number(formatUnits(cabBalance, tokenDecimals.USDC));
        const maxAmountValue = balance - estimatedBaseFee;
        setMaxAmount(maxAmountValue > 0 ? maxAmountValue.toFixed(6) : "0");
      }
    } catch (error) {
      console.error("Error estimating base fee:", error);
      setBaseFeeEstimate(null);
      setIsLoadingEstimateFees(false);
    }
  }, [selectedChainId, estimateFees, cabBalance, address]);

  // Estimate transaction fees based on user inputs
  const estimateTransactionFees = useCallback(async () => {
    if (
      !recipient ||
      !amount ||
      !selectedChainId ||
      !isAddress(recipient) ||
      parseFloat(amount) <= 0
    ) {
      setFeeEstimate(null);
      setInsufficientBalance(false);
      return;
    }

    // Check if amount equals maxAmount and use baseFeeEstimate
    if (amount === maxAmount && baseFeeEstimate !== null) {
      const estimatedFee = baseFeeEstimate;
      setFeeEstimate(estimatedFee.toFixed(6));

      // Update insufficientBalance
      if (cabBalance) {
        const balance = Number(formatUnits(cabBalance, tokenDecimals.USDC));
        const totalAmount = parseFloat(amount) + estimatedFee;
        setInsufficientBalance(totalAmount > balance);
      }
      return;
    }

    try {
      const tokenAddress = tokenAddresses[
        selectedChainId as keyof typeof tokenAddresses
      ]?.USDC as `0x${string}`;

      if (!tokenAddress) {
        console.error("USDC address not found for the selected chain");
        setFeeEstimate(null);
        return;
      }

      const transferCall = {
        to: tokenAddress,
        data: encodeFunctionData({
          abi: erc20Abi,
          functionName: "transfer",
          args: [recipient as `0x${string}`, parseUnits(amount, tokenDecimals.USDC)],
        }),
        value: 0n,
      };

      setIsLoadingEstimateFees(true);
      const result = await estimateFees({
        calls: [transferCall],
        repayTokens: [],
        chainId: selectedChainId,
      });
      setIsLoadingEstimateFees(false);

      if (result.error) {
        setFeeEstimate(null);
        console.error("Error estimating fees:", result.error);
        return;
      }

      const baseFee = Number(result.estimatedFee);
      const feeBuffer = 1.03;
      const estimatedFee = parseFloat((baseFee * feeBuffer).toFixed(6));
      setFeeEstimate(estimatedFee.toFixed(6));

      // Update insufficientBalance
      if (cabBalance) {
        const balance = Number(formatUnits(cabBalance, tokenDecimals.USDC));
        const totalAmount = parseFloat(amount) + estimatedFee;
        setInsufficientBalance(totalAmount > balance);
      }
    } catch (error) {
      console.error("Error estimating transaction fees:", error);
      setFeeEstimate(null);
      setIsLoadingEstimateFees(false);
    }
  }, [
    recipient,
    amount,
    selectedChainId,
    estimateFees,
    cabBalance,
    maxAmount,
    baseFeeEstimate,
  ]);

  // Re-estimate base fee when modal opens or chain changes
  useEffect(() => {
    if (open) {
      estimateBaseFee();
    }
  }, [open, estimateBaseFee]);

  // Re-estimate transaction fees when relevant inputs change
  useEffect(() => {
    estimateTransactionFees();
  }, [estimateTransactionFees]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || parseFloat(value) >= 0) {
      setAmount(value);
    }
  };

  const handleSetMaxAmount = () => {
    if (maxAmount) {
      setAmount(maxAmount);
      setInsufficientBalance(false);
      // Since we're using baseFeeEstimate, set feeEstimate accordingly
      if (baseFeeEstimate !== null) {
        setFeeEstimate(baseFeeEstimate.toFixed(6));
      }
    }
  };

  const { sendToken, isLoading } = useSendErc20Token({
    onSuccess: (userOpHash) => {
      console.log("Token sent successfully, userOpHash:", userOpHash);
      toast.success(
        <div className="flex flex-col items-start space-y-2 text-sm">
          <span className="font-semibold text-green-600">Send successful!</span>
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
      setAmount("");
      setRecipient("");
      onClose();
    },
  });

  const handleSend = () => {
    if (!recipient || !amount || !selectedChainId) return;

    const tokenAddress = tokenAddresses[
      selectedChainId as keyof typeof tokenAddresses
    ]?.USDC as `0x${string}`;
    if (!tokenAddress) {
      console.error("USDC address not found for the selected chain");
      return;
    }

    sendToken({
      tokenAddress,
      toAddress: recipient as `0x${string}`,
      chainId: selectedChainId,
      amount,
      decimals: tokenDecimals.USDC,
    });
  };

  return (
    <Modal open={open} handleClose={onClose} showPoweredBy={false}>
      <h2 className="text-2xl font-semibold mb-6">Send</h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            From
          </label>
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-blue-500 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
              <span className="font-medium">
                {address?.slice(0, 6)}...{address?.slice(-4)}
              </span>
            </div>
            <span className="text-sm text-gray-500">
              $
              {cabBalance
                ? Number(formatUnits(cabBalance, tokenDecimals.USDC)).toFixed(6)
                : "0.00"}
            </span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Chain
          </label>
          <ChainSelect
            selectedChainId={selectedChainId}
            onChainSelect={(chainId) => {
              setSelectedChainId(chainId);
              setRecipient("");
            }}
          />
        </div>

        {/* Recipient Address */}
        <div>
          <label
            htmlFor="recipient"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            To
          </label>
          <input
            type="text"
            id="recipient"
            className={`w-full p-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
              isValidAddress === false ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Search or enter address"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          {isValidAddress === false && (
            <p className="mt-1 text-sm text-red-600">Invalid address.</p>
          )}
        </div>

        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Amount
          </label>
          <div className="relative">
            <input
              type="number"
              id="amount"
              className="w-full p-3 pr-16 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
              value={amount}
              onChange={handleAmountChange}
              min="0"
              step="any"
              disabled={isLoadingEstimateFees}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              <button
                type="button"
                onClick={handleSetMaxAmount}
                className="text-sm text-blue-600 font-medium hover:text-blue-800"
                disabled={isLoadingEstimateFees || !maxAmount}
              >
                Max
              </button>
            </div>
          </div>
          {insufficientBalance && (
            <p className="mt-1 text-sm text-red-600">Insufficient balance.</p>
          )}
          {feeEstimate && !isLoadingEstimateFees && (
            <p className="mt-1 text-sm text-gray-600">
              Estimated fee: ${feeEstimate} USDC
            </p>
          )}
          {isLoadingEstimateFees && (
            <p className="mt-1 text-sm text-gray-600">Estimating fee...</p>
          )}
        </div>
      </div>

      <Button
        variant="contained"
        sx={{ textTransform: "none", mt: 2, borderRadius: "1rem" }}
        fullWidth
        onClick={handleSend}
        disabled={
          isLoading ||
          isLoadingEstimateFees ||
          isValidAddress === false ||
          !recipient ||
          !amount ||
          insufficientBalance ||
          !feeEstimate
        }
      >
        {isLoading ? (
          <>
            Sending...
            <CircularProgress size={20} color="inherit" sx={{ ml: 2 }} />
          </>
        ) : isLoadingEstimateFees ? (
          "Estimating Fees..."
        ) : (
          "Send"
        )}
      </Button>
    </Modal>
  );
}

export default SendModal;