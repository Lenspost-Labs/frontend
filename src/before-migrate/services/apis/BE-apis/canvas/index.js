import { API, api } from "../config";

export const mintToXchain = async (paramsData) => {
  const result = await api.post(`${API}/user/canvas/minted`, paramsData);

  return result?.data;
};
