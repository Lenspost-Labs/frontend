/**
 * Generates a Zora URL based on the contract address.
 * @param {string} contractAddress - The address of the contract.
 * @returns {string} The Zora URL.
 */
// import { ENVIRONMENT } from "../../../../../../../services";

import { ENVIRONMENT } from "../../../../../../../services/env/env";

/**
 * https://testnet.zora.co/collect/gor:0x56134d20bc6e559431c3720661f703a6f672d22c
 * ERC721 Testnet Goerli
 */

const mainnetPrefixes = {
  1: "eth",
  5: "eth",
  8453: "base",
  7777777: "zora",
  10: "oeth",
  42161: "arb",
};

export const zoraURLErc721 = (contractAddress, chainId) => {
  const mainnetPrefix = () => {
    return mainnetPrefixes[chainId] || undefined;
  };

  return `https://${
    ENVIRONMENT === "production" ? "" : "testnet."
  }zora.co/collect/${
    ENVIRONMENT === "production" ? mainnetPrefix() : "gor"
  }:${contractAddress}`;
};

/**
 * https://testnet.zora.co/collect/zgor:0x40583f3414f276fee55c126151e6a28dcafe4df8/premint-2 erc1155
 * ERC1155 Testnet Goerli
 *
 * https://zora.co/collect/zora:0x40583f3414f276fee55c126151e6a28dcafe4df8/premint-1
 * ERC1155 Mainnet Zora
 */

export const zoraURLErc1155 = (contractAddress, tokenId, chainId) => {
  return `https://${ENVIRONMENT != "production" && "testnet."}zora.co/collect/${
    ENVIRONMENT != "production" ? "zgor" : "zora"
  }:${contractAddress}/premint-${tokenId}`;
};
