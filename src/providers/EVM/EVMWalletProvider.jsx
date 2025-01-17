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
import {
  ALCHEMY_API_KEY,
  ENVIRONMENT,
  PRIVY_APP_ID,
  WALLETCONNECT_PROJECT_ID,
} from "../../services";
import { cookieStorage, createStorage, http } from "wagmi";
import { ham, og } from "../../data";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";
import { storyOdysseyTestnet } from "../../data/network/storyOdyssey";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";

// Replace this with your Privy config
export const privyConfig = {
  appearance: {
    loginMessage: "Login to Poster.fun",
    walletList: ["coinbase_wallet", "detected_wallets", "wallet_connect"],
    showWalletLoginFirst: true,
  },
  loginMethods: ["wallet"],
  externalWallets: {
    coinbaseWallet: {
      connectionOptions: "all",
    },
  },
};

const RPC_PAYMASTER =
  "https://api.developer.coinbase.com/rpc/v1/base/xGpaZvJ1cY6fUbaBnQAnA4BMrE4keI76";

export const config = createConfig({
  appName: "Poster.fun",
  projectId: WALLETCONNECT_PROJECT_ID,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [
    injected(),
    coinbaseWallet(),
    walletConnect({ projectId: WALLETCONNECT_PROJECT_ID }),
  ],
  chains:
    ENVIRONMENT === "production"
      ? [
          base,
          mainnet,
          zora,
          optimism,
          arbitrum,
          polygon,
          degen,
          ham,
          og,
          storyOdysseyTestnet,
        ]
      : [
          base,
          baseSepolia,
          zora,
          optimism,
          arbitrum,
          polygonMumbai,
          polygon,
          degen,
          ham,
          og,
          storyOdysseyTestnet,
        ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [zora.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [degen.id]: http(),
    [ham.id]: http(),
    [og.id]: http(),
    [polygonMumbai.id]: http(),
    [baseSepolia.id]: http(),
    [arbitrum.id]: http(),
    [storyOdysseyTestnet.id]: http(),
  },
});

const queryClient = new QueryClient();

const EVMWalletProvider = ({ children }) => {
  return (
    <PrivyProvider appId={PRIVY_APP_ID} config={privyConfig}>
      <QueryClientProvider client={queryClient}>
        <WagmiProvider config={config}>{children}</WagmiProvider>
      </QueryClientProvider>
    </PrivyProvider>
  );
};

export default EVMWalletProvider;
