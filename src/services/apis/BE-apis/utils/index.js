import { API, api } from "../config";

export const redeemCode = async ({ code, address }) => {
  const result = await api.post(`${API}/util/redeem-code`, {
    code: code,
    address: address,
  });

  return result.data;
};

export const searchChannelFar = async (channel) => {
  const result = await api.get(`${API}/util/search-channel?channel=${channel}`);

  return result.data;
};

export const uploadAsset = async (image) => {
  const result = await api.post(`${API}/util/upload-image`, {
    image,
  });

  return result.data;
};
