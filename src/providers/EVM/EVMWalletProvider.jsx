import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  polygon,
  mainnet,
  zora,
  optimism,
  base,
  polygonMumbai,
  baseSepolia,
  arbitrum,
  degen,
} from "wagmi/chains";
import { ENVIRONMENT, WALLETCONNECT_PROJECT_ID } from "../../services";
import { http } from "wagmi";
import { ham } from "../../data";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";

// Replace this with your Privy config
export const privyConfig = {
  appearance: {
    loginMessage: "Login to Poster.fun",
    walletList: ["coinbase_wallet", "detected_wallets", "wallet_connect"],
    showWalletLoginFirst: true,
  },
  loginMethods: ["wallet","farcaster"],
  externalWallets: {
    coinbaseWallet: {
      connectionOptions: "all",
    },
  },
};

export const config = createConfig({
  appName: "Poster.fun",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains:
    ENVIRONMENT === "production"
      ? [base, mainnet, zora, optimism, arbitrum, polygon, degen, ham]
      : [base, baseSepolia, polygonMumbai, degen, ham],
  transports: {
    [mainnet.id]: http(),
    [polygon.id]: http(),
    [zora.id]: http(),
    [optimism.id]: http(),
    [base.id]: http(),
    [polygonMumbai.id]: http(),
    [baseSepolia.id]: http(),
    [arbitrum.id]: http(),
    // [degen.id]: http(),
    // [ham.id]: http(),
  },
});

const queryClient = new QueryClient();

const EVMWalletProvider = ({ children }) => {
  return (
    <PrivyProvider appId="clvysua9y0a63qk92kex0ulud" config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};

export default EVMWalletProvider;
