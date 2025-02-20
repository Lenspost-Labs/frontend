import { defineChain } from "viem";

export const storyOdysseyTestnet = defineChain({
  nativeCurrency: {
    symbol: "IP",
    decimals: 18, // Replace this with the number of decimals for your chain's native token
    name: "IP",
  },
  rpcUrls: {
    default: {
      webSocket: ["wss://odyssey.storyrpc.io"],
      http: ["https://odyssey.storyrpc.io"],
    },
  },
  blockExplorers: {
    default: { url: "https://odyssey.storyscan.xyz", name: "Explorer" },
  },
  name: "Story Odyssey Testnet",
  network: "story-testnet",
  id: 1516, // Replace this with your chain's ID
});
