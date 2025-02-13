import { defineChain } from "@reown/appkit/networks";

export const storyMainnet = defineChain({
  nativeCurrency: {
    symbol: "IP",
    decimals: 18, // Replace this with the number of decimals for your chain's native token
    name: "IP",
  },
  rpcUrls: {
    default: {
      webSocket: [],
      http: ["https://mainnet.storyrpc.io"],
    },
  },
  blockExplorers: {
    default: { url: "https://dev-mainnet.storyscan.xyz", name: "Explorer" },
  },
  name: "Story",
  network: "story",
  id: 1514, // Replace this with your chain's ID
});
