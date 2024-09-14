import { API, api } from "../../config";

export const farUserRegister = async ({ signer_uuid, fid }) => {
  const result = await api.post(`${API}/auth/evm/farcaster/register`, {
    signer_uuid: signer_uuid,
    fid: fid,
  });

  return result?.data;
};

export const getFarUserDetails = async () => {
  const result = await api.get(`${API}/auth/evm/farcaster/check`);

  return result?.data;
};
