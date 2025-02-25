import { useContext } from "react";
import { Context } from "../../providers/context";
import useReset from "./useReset";
import * as Sentry from "@sentry/react";
import { useDisconnect } from "wagmi";
import { saveToLocalStorage } from "../../utils";
import { LOCAL_STORAGE } from "../../data";
import usePrivyAuth from "../privy-auth/usePrivyAuth";

const useLogout = () => {
  const { logout: logoutPrivy, disconnect } = usePrivyAuth();
  const { disconnect: disconnectWagmi } = useDisconnect();
  const { posthog, setIsLoggedOut } = useContext(Context);
  const { resetState } = useReset();

  const logout = () => {
    console.log("logout");
    setIsLoggedOut(true);
    disconnect();
    disconnectWagmi();
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
