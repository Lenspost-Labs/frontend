import { defineChain } from "viem";

export const basecampTestnet = defineChain({
  id: 123420001114,
  name: "Basecamp Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "Camp",
    symbol: "CAMP",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.basecamp.t.raas.gelato.cloud"],
      webSocket: ["wss://ws.basecamp.t.raas.gelato.cloud"],
    },
  },
  blockExplorers: {
    default: {
      name: "Explorer",
      url: "https://basecamp.cloud.blockscout.com",
    },
  },
  contracts: {},
});
