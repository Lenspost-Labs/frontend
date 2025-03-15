import { useContext } from "react";
import { Context } from "../../providers/context";
import { useLogin, usePrivy } from "@privy-io/react-auth";
import { useAccount, useDisconnect } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { evmAuth } from "../../services";
import { toast } from "react-toastify";
import { saveToLocalStorage } from "../../utils";
import { LOCAL_STORAGE } from "../../data";
import * as Sentry from "@sentry/react";

const usePrivyAuth = () => {
  const { posthog, setText, setIsLoading, setSession, setOpenedLoginModal } =
    useContext(Context);
  const { logout } = usePrivy();
  const { disconnect } = useDisconnect();

  const { mutateAsync: evmAuthAsync } = useMutation({
    mutationKey: "evmAuth",
    mutationFn: evmAuth,
  });

  const { login } = useLogin({
    onComplete: (user) => {
      evmAuthAsync({
        walletAddress: user?.user?.wallet?.address,
        signature: "",
      })
        .then((res) => {
          toast.success("Login successful", { toastId: "success1" });
          saveToLocalStorage(LOCAL_STORAGE.evmAuth, true);
          saveToLocalStorage(LOCAL_STORAGE.userAuthToken, res.jwt);
          saveToLocalStorage(LOCAL_STORAGE.userAuthTime, new Date().getTime());
          saveToLocalStorage(
            LOCAL_STORAGE.userAddress,
            user?.user?.wallet?.address
          );
          saveToLocalStorage(LOCAL_STORAGE.lensAuth, {
            profileId: res?.profileId,
            profileHandle: res?.profileHandle,
          });
          saveToLocalStorage(LOCAL_STORAGE.userId, res?.userId);
          Sentry.setUser({
            id: res?.userId,
          });
          setSession(res.jwt);
          setOpenedLoginModal(false);

          posthog.identify(res?.userId, {
            evm_address: user?.user?.wallet?.address,
          });
        })
        .catch((error) => {
          console.log("error by auth endpoint");
          console.log(error);
          toast.error("Something went wrong", { toastId: "error1" });
          logout();
          disconnect();
          setIsLoading(false);
          setOpenedLoginModal(false);
          setText("");
        });
    },
    onError: (error) => {
      console.log("error by privy");
      console.log(error);
      toast.error("Something went wrong", { toastId: "error2" });
      logout();
      disconnect();
      setIsLoading(false);
      setOpenedLoginModal(false);
      setText("");
    },
  });

  return {
    login,
    logout,
    disconnect,
  };
};

export default usePrivyAuth;
