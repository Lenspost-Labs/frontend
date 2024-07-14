import { LOCAL_STORAGE } from "../../data";

const useAppAuth = () => {
  const isAuthenticated = localStorage.getItem(LOCAL_STORAGE.userAuthToken);
  return { isAuthenticated };
};

export default useAppAuth;
