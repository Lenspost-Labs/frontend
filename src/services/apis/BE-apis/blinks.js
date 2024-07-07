import { API, api } from "./config";

export const createBLinks = async (params) => {
  const res = await api.post(`${API}/util/create-blink-data`, params);
  return res.data;
};
