import { ENVIRONMENT } from "../../services";
import { FRAME_URLS } from "./frameUrls";
import { MINT_URLS } from "./mintUrls";

// Sign messages
export const EVM_MESSAGE = "This message is to login you into lenspost dapp.";

export const SOLANA_MESSAGE =
  "Clicking Sign or Approve only means you have proved this wallet is owned by you. This request will not trigger any blockchain transaction or cost any gas fee.";

// App constants
export const APP_NAME = "Poster";
export const APP_DESCRIPTION = `${APP_NAME} is a fun onchain 'canva' that turns NFT holders into content creators with one click drag-drop-remix! Make NFTs do more for you as you churn out DOPE memes, gifs, social content & more! The most fun way to permissionlessly collaborate, monetize & even split revenues across chains. We're NFT INFRA at the back, RAVE party in the front - powering co-creation, revenue share & social distribution with BIG MEME ENERGY!`;
export const APP_URL = "https://app.poster.fun";

export const APP_LENS_HANDLE = "@lenspost";
export const APP_SOLANA_ADDRESS =
  "2PsV6hNEUc3rSMGqKcHTnRBemaWBQX3dYgUqVtEFxkwa";
export const APP_ETH_ADDRESS = "0xc5b436A62f7d0A5412f60C74BD1dac3ff404eB2a"; //'0x77fAD8D0FcfD481dAf98D0D156970A281e66761b'

export const FREE_MINTS = 10;
export const FRAME_URL = FRAME_URLS[ENVIRONMENT];
export const MINT_URL = MINT_URLS[ENVIRONMENT];

// this is wrap degen
export const ETH_CURRENCY_ADDRESS =
  "0x0000000000000000000000000000000000000000";
export const WDEGEN_CURRENCY_ADDRESS =
  "0xeb54dacb4c2ccb64f8074eceea33b5ebb38e5387";
export const DEGEN_CURRENCY_ADDRESS =
  "0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed";
export const STORY_ODYSSEY_ADDRESS =
  "0xBDE2AF89cf844ffDA70885131Da8BA3804bc48Bf";

export const isSponsoredChain = [8453, 42161, 137, 2818, 123420001114];
export const posterTokenSymbol = "Gold";
export const R2_IMAGE_URL =
  "https://pub-2ae8c1134d9a4424b3e00475c4421a7a.r2.dev";
export const CDN_IMAGE_URL = "https://lenspost-r2.b-cdn.net";

export const X_INTENT_URL = "https://x.com/intent/post?text=";
export const WARPCAST_EMBED_INTENT_URL =
  "https://warpcast.com/~/compose?text=Mint your NFT on &embeds[]=";

export const LP721SupportedChains = [2818, 325000];

export const gasFeeForDeployment = {
  1: 0.00009, // eth mainnet
  5: 0.00009, // eth Goerli
  11155111: 0.00009, // eth Sepolia
  8453: 0.00009, // base mainnet
  84532: 0.00009, // base Sepolia
  7777777: 0.00009, // zora mainnet
  999999999: 0.00009, // zora Sepolia
  10: 0.00009, // optimism mainnet
  42161: 0.00009, // arbitrum mainnet
  666666666: 0.00009, // degen mainnet
  5112: 0.00009, // ham mainnet
  16600: 0.00009, // og mainnet
  137: 0.7, // polygon mainnet
  1155: 0.00009, // story testnet
  2818: 0.0002, // morph mainnet
  325000: 0.00009, // camp network testnet
  1516: 0.08, // story odyssey testnet
  1315: 0.08, // story aeneid testnet
  1514: 0.08, // story mainnet
  80001: 0.00009, // polygon mumbai
};

export const gasFeeForMint = {
  1: 0.00009, // eth mainnet
  5: 0.00009, // eth Goerli
  11155111: 0.00009, // eth Sepolia
  8453: 0.00009, // base mainnet
  84532: 0.00009, // base Sepolia
  7777777: 0.00009, // zora mainnet
  999999999: 0.00009, // zora Sepolia
  10: 0.00009, // optimism mainnet
  42161: 0.00009, // arbitrum mainnet
  666666666: 0.00009, // degen mainnet
  5112: 0.00009, // ham mainnet
  16600: 0.00009, // og mainnet
  137: 0.00009, // polygon mainnet
  1155: 0.00009, // story testnet
  2818: 0.00009, // morph mainnet
  325000: 0.00009, // camp network testnet
  1516: 0.08, // story odyssey testnet
  1315: 0.08, // story aeneid testnet
  1514: 0.08, // story mainnet
  80001: 0.00009, // polygon mumbai
};

export const gasFeeForOxSplitCreate = {
  1: 0.00009, // eth mainnet
  5: 0.00009, // eth Goerli
  11155111: 0.00009, // eth Sepolia
  8453: 0.00009, // base mainnet
  84532: 0.00009, // base Sepolia
  7777777: 0.00009, // zora mainnet
  999999999: 0.00009, // zora Sepolia
  10: 0.00009, // optimism mainnet
  42161: 0.00009, // arbitrum mainnet
  666666666: 0.00009, // degen mainnet
  5112: 0.00009, // ham mainnet
  16600: 0.00009, // og mainnet
  137: 0.7, // polygon mainnet
  1155: 0.00009, // story testnet
  2818: 0.0002, // morph mainnet
  325000: 0.00009, // camp network testnet
  1516: 0.08, // story odyssey testnet
  1315: 0.08, // story aeneid testnet
  1514: 0.08, // story mainnet
  80001: 0.00009, // polygon mumbai
};
