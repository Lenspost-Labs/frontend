import { TOKEN_LIST } from "../data";

export const priceFormatter = (chainName, tokenAddress, price) => {
  const decimals =
    TOKEN_LIST[chainName]?.find((token) => token.address === tokenAddress)
      ?.decimals || 18;

  return Number(price) * 10 ** decimals;
};
