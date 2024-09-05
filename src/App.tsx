import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";
import Account from "./components/Account";
import AppSection from "./components/AppSection";
import { useAccount } from "wagmi";
import Modal from "./components/Modal";
import { BackgroundImage } from "./components/BackgroundImages";
import { useTokenBalances } from "./hooks/useTokenBalances";
import TokenBalances from "./components/TokenBalances";

function App() {
  const { isConnected } = useAccount();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: tokenBalances, isLoading } = useTokenBalances("0x012d578942AFB68Df62596AB399925548E14800f", 10);
  console.log(tokenBalances, isLoading);
  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative">
      <Header />
      <BackgroundImage className="absolute inset-0 -z-10" />
      <main className="flex-grow container mx-auto px-4 py-8 relative">
        <div className="flex flex-col md:flex-row items-start justify-start w-full gap-4">
          <div className="w-full md:max-w-[32%] flex flex-col gap-4">
            <Account />
            {/* {isConnected && <TokenBalances />} */}
          </div>
          <AppSection />
        </div>
      </main>
      <Modal open={isModalOpen} handleClose={() => setIsModalOpen(false)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">
            Welcome to ZeroDev's Magic Account demo
          </h2>
          <ol className="space-y-4 inline-block text-left py-4">
            {[
              "Connect or create a Magic Account",
              "Deposit USDC into the Magic Account",
              "Use your chain-abstracted USDC on any app, on any chain!",
            ].map((step, index) => (
              <li key={index} className="flex items-center space-x-3">
                <span className="flex items-center justify-center w-8 h-8 border border-blue-600 rounded-full shrink-0 text-blue-600">
                  {index + 1}
                </span>
                <span className="text-gray-700">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </Modal>
    </div>
  );
}

export default App;
