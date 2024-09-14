export const getAvatar = (address) => {
  return `https://api.dicebear.com/7.x/pixel-art/svg?seed=${address}`;
};
