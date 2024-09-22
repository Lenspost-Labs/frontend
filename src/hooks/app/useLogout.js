import { useDisconnect } from "wagmi";
import { useSolanaWallet } from "../solana";
import { useContext } from "react";
import { Context } from "../../providers/context";
import useReset from "./useReset";
import * as Sentry from "@sentry/react";
import { usePrivy } from "@privy-io/react-auth";

const useLogout = () => {
  const { solanaDisconnect } = useSolanaWallet();
  const { disconnect } = useDisconnect();
  const { posthog } = useContext(Context);
  const { resetState } = useReset();
  const { logout: privyLogout } = usePrivy();

  const logout = () => {
    localStorage.clear();
    resetState();
    disconnect();
    solanaDisconnect();
    privyLogout();
    posthog.reset();
    Sentry.setUser(null);
  };

  return {
    logout,
  };
};

export default useLogout;
