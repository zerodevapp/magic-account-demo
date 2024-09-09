import { useState } from "react";
import { useConnect } from "wagmi";
import GoogleIcon from "./GoogleIcon";
import FingerprintIcon from "@mui/icons-material/Fingerprint";
import PasskeyLogin from "./PasskeyLogin";
import BrowserWalletIcon from "./BrowserWalletIcon";

export default function LoginOptions() {
  const [showPasskeyLogin, setShowPasskeyLogin] = useState(false);
  const { connectors, connect, isPending } = useConnect();

  const handleGoogleLogin = () => {
    const googleConnector = connectors.find(
      (connector) => connector.name === "Google"
    );
    if (googleConnector) {
      connect({ connector: googleConnector });
    } else {
      console.error("Google connector not found");
    }
  };

  return (
    <div className="flex flex-col items-center w-full space-y-4">
      {!showPasskeyLogin && (
        <div className="w-full flex flex-col gap-2">
          <LoginButton
            icon={<GoogleIcon />}
            text="Google"
            iconColor="text-black"
            onClick={handleGoogleLogin}
            disabled={isPending}
          />
          <LoginButton
            icon={<FingerprintIcon />}
            text="Sign in with Passkey"
            iconColor="text-black"
            onClick={() => {
              setShowPasskeyLogin(true);
            }}
          />
          <LoginButton
            icon={<BrowserWalletIcon />}
            text="Connect with Browser Wallet"
            iconColor="text-orange-500"
            onClick={() => connect({ connector: connectors.find(connector => connector.name === 'Injected')! })}
            disabled={isPending}
          />
        </div>
      )}
      {showPasskeyLogin && <PasskeyLogin />}
    </div>
  );
}

type LoginButtonProps = {
  icon: React.ReactNode;
  text: string;
  iconColor: string;
  onClick?: () => void;
  disabled?: boolean;
};

function LoginButton({ icon, text, iconColor, onClick, disabled }: LoginButtonProps) {
  return (
    <button
      className={`flex w-full items-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-transparent`}
      onClick={onClick}
      disabled={disabled}
    >
      <div className={`mr-3 ${iconColor}`}>{icon}</div>
      <span className="text-sm font-semibold leading-6">{text}</span>
    </button>
  );
}
