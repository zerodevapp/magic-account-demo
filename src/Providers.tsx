import { AuthModalProvider } from "./providers/AuthModalProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { injected } from "wagmi/connectors";
import { polygon, arbitrum, base, optimism } from "wagmi/chains";
import { passkeyConnector, wrapEOAConnector } from "@magic-account/wagmi";
import { SupplyBorrowModalProvider } from "./providers/SupplyBorrowModalProvider";

export default function Providers({ children }: { children: ReactNode }) {
  const config = createConfig({
    chains: [arbitrum, base, optimism, polygon],
    transports: {
      [optimism.id]: http(),
      [base.id]: http(),
      [arbitrum.id]: http(),
      [polygon.id]: http(),
    },
    connectors: [passkeyConnector(), wrapEOAConnector(injected())],
    multiInjectedProviderDiscovery: false,
  });
  const queryClient = new QueryClient();

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AuthModalProvider>
          <SupplyBorrowModalProvider>{children}</SupplyBorrowModalProvider>
        </AuthModalProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
