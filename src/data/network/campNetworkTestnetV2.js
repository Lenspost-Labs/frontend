import { defineChain } from "viem";

export const campNetworkTestnetV2 = defineChain({
  id: 325000,
  name: "Camp Network Testnet V2",
  nativeCurrency: {
    decimals: 18,
    name: "Ether",
    symbol: "ETH",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc-campnetwork.xyz"],
      webSocket: ["wss://rpc-campnetwork.xyz"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://camp-network-testnet.blockscout.com",
    },
  },
  contracts: {},
});
