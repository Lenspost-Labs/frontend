// funtion to crop address
export const addressCrop = (address) => {
  return `${address?.slice(0, 4)}...${address?.slice(-4)}`;
};
