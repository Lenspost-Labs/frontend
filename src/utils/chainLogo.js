import {
  BaseLogo,
  EthLogo,
  ZoraLogo,
  OpMainnetLogo,
  arbitrumLogo,
  degenLogo,
  HamLogo,
  polygonLogo,
  StoryIPLogo,
  MorphLogo,
  campNetworkTestnetV2Logo,
} from "../assets";

const chainLogos = {
  1: EthLogo, // eth mainnet
  5: EthLogo, // eth Goerli
  11155111: EthLogo, // eth Sepolia
  8453: BaseLogo, // base mainnet
  84532: BaseLogo, // base Sepolia
  7777777: ZoraLogo, // zora mainnet
  999999999: ZoraLogo, // zora Sepolia
  10: OpMainnetLogo, // optimism mainnet
  42161: arbitrumLogo, // arbitrum mainnet
  666666666: degenLogo, // degen mainnet
  5112: HamLogo, // ham mainnet
  16600: EthLogo, // og mainnet
  137: polygonLogo, // polygon mainnet
  1155: StoryIPLogo, // story testnet
  2818: MorphLogo, // morph mainnet
  325000: campNetworkTestnetV2Logo, // camp network testnet
  123420001114: campNetworkTestnetV2Logo, // basecamp testnet
  1516: StoryIPLogo, // story odyssey testnet
  1315: StoryIPLogo, // story aeneid testnet
  1514: StoryIPLogo, // story mainnet
  80001: polygonLogo, // polygon mumbai
};

export const chainLogo = (chainId) => {
  return chainLogos[chainId] || null;
};
