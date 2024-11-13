import { useAccount } from "wagmi";
import { useEnableCab } from "@zerodev/magic-account";
import { useCallback, useEffect, useState } from "react";

export default function useAutoEnableCab() {
  const { enableCab, isEnabledOnCurrentChain } = useEnableCab();
  const { isConnected } = useAccount();
  const [isEnablingCab, setIsEnablingCab] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);

  const register = useCallback(async () => {
    try {
      if (!isEnabledOnCurrentChain("USDC")) {
        setIsEnablingCab(true);
        await enableCab({
          tokens: [{ name: "USDC" }],
        });
        setIsEnabled(true);
        // Wait for 3 seconds
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsEnablingCab(false);
    }
  }, [isEnabledOnCurrentChain, enableCab]);

  useEffect(() => {
    if (
      isConnected &&
      !isEnabledOnCurrentChain("USDC") &&
      // !isPending &&
      !isEnabled
    ) {
      register();
    }
  }, [
    isConnected,
    register,
    isEnabledOnCurrentChain,
    // isPending,
    // isEnablingCab,
    isEnabled,
  ]);

  return { isEnablingCab, isEnabled };
}
