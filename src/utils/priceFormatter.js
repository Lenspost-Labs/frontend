import { TOKEN_LIST } from "../data";

export const priceFormatter = (tokenAddress, price) => {
  const decimals = TOKEN_LIST[tokenAddress]?.decimals || 18;

  return Number(price) * 10 ** decimals;
};
