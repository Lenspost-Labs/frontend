import { useContext } from "react";
import { Context } from "../../providers/context";
import useReset from "./useReset";
import * as Sentry from "@sentry/react";
import usePrivyAuth from "../privy-auth/usePrivyAuth";

const useLogout = () => {
  const { disconnect, logout: logoutPrivy } = usePrivyAuth();
  const { posthog, setIsLoggedOut } = useContext(Context);
  const { resetState } = useReset();

  const logout = () => {
    console.log("logout");
    setIsLoggedOut(true);
    disconnect();
    logoutPrivy();
    //saveToLocalStorage(LOCAL_STORAGE.evmConnected, false)
    localStorage.clear();
    resetState();
    posthog.reset();
    Sentry.setUser(null);
  };

  return {
    logout,
  };
};

export default useLogout;
