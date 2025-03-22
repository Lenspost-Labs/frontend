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
  morph,
} from "wagmi/chains";
import {
  ENVIRONMENT,
  PRIVY_APP_ID,
  WALLETCONNECT_PROJECT_ID,
} from "../../services";
import { http } from "wagmi";
import { basecampTestnet, storyMainnet, storyAeneidTestnet } from "../../data";

import { PrivyProvider } from "@privy-io/react-auth";
import { WagmiProvider, createConfig } from "@privy-io/wagmi";

// Replace this with your Privy config
export const privyConfig = {
  embeddedWallets: {
    createOnLogin: "users-without-wallets",
    requireUserPasswordOnCreate: false,
    showWalletUIs: true,
    ethereum: {
      createOnLogin: "users-without-wallets",
    },
  },
  fundingMethodConfig: {
    moonpay: {
      useSandbox: true,
    },
  },
  mfa: {
    noPromptOnMfaRequired: false,
  },
  appearance: {
    accentColor: "#6A6FF5",
    theme: "#FFFFFF",
    showWalletLoginFirst: false,
    logo: "https://lenspost-r2.b-cdn.net/web-assets/Poster_logo.png",
    walletChainType: "ethereum-only",
    walletList: ["coinbase_wallet", "detected_wallets", "wallet_connect"],
  },
  loginMethods: [
    "wallet",
    "google",
    // "twitter",
    "farcaster",
    // "telegram",
    // "discord",
  ],
};

export const config = createConfig({
  appName: "Poster.fun",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains:
    ENVIRONMENT === "production"
      ? [
          base,
          mainnet,
          zora,
          optimism,
          arbitrum,
          polygon,
          storyMainnet,
          basecampTestnet,
          morph,
        ]
      : [
          base,
          baseSepolia,
          zora,
          optimism,
          arbitrum,
          polygonMumbai,
          polygon,
          storyAeneidTestnet,
          basecampTestnet,
          morph,
        ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
    [zora.id]: http(),
    [optimism.id]: http(),
    [polygon.id]: http(),
    [storyMainnet.id]: http(),
    [basecampTestnet.id]: http(),
    [morph.id]: http(),
    [polygonMumbai.id]: http(),
    [baseSepolia.id]: http(),
    [arbitrum.id]: http(),
  },
});

export const wagmiAdapter = createConfig({
  chains: config?.chains,
  transports: config?.transports,
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
