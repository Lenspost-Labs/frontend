import { defineChain } from "@reown/appkit/networks";

export const storyAeneidTestnet = defineChain({
  nativeCurrency: {
    symbol: "IP",
    decimals: 18, // Replace this with the number of decimals for your chain's native token
    name: "IP",
  },
  rpcUrls: {
    default: {
      webSocket: [],
      http: ["https://aeneid.storyrpc.io"],
    },
  },
  blockExplorers: {
    default: { url: "https://aeneid.storyscan.xyz", name: "Explorer" },
  },
  name: "Story Aeneid Testnet",
  network: "story-aeneid-testnet",
  id: 1315, // Replace this with your chain's ID
});
