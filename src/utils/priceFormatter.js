const MULTIPLIER_DEFAULT = 10 ** 18;

const MULTIPLIER_MAP = {
  USDC: 10 ** 6,
  USDT: 10 ** 6,
};

export const priceFormatter = (tokenSymbol, price) => {
  const multiplier = MULTIPLIER_MAP[tokenSymbol] || MULTIPLIER_DEFAULT;

  return Number(price) * multiplier;
};
