import { useState, useEffect } from "react";
import Header from "./components/Header";
import "./App.css";
import Account from "./components/Account";
import AppSection from "./components/AppSection";
import Modal from "./components/Modal";

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsModalOpen(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start justify-start w-full gap-4">
          <div className="w-full md:max-w-[32%]">
            <Account />
          </div>
          <AppSection />
        </div>
      </main>
      <footer className="bg-gray-100 py-4">
        <div className="container mx-auto px-4">{/* Footer content */}</div>
      </footer>
      <Modal open={isModalOpen} handleClose={() => setIsModalOpen(false)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Welcome to ZeroDev's Magic Account demo</h2>
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
