import { useAccount, useDisconnect } from "wagmi";
import ShareButton from "./share/ShareButton";
import DownloadBtn from "./download/DownloadBtn";
import { ENVIRONMENT } from "../../../../services";
import { useAppAuth } from "../../../../hooks/app";
import { Typography } from "@material-tailwind/react";
import { EVMWallets, SolanaWallets } from "./auth/wallets";
import Logo from "./logo/Logo";
import PointsBtn from "./PointsBtn/PointsBtn";
import MobileLoginBtn from "./auth/MobileLoginBtn";
import { useContext } from "react";
import LoginModal from "./auth/LoginModal";
import { Context } from "../../../../providers/context";
import { useMutation } from "@tanstack/react-query";
import { evmAuth } from "../../../../services";
import { LOCAL_STORAGE } from "../../../../data";
import { useLogin } from "@privy-io/react-auth";
import { usePrivy } from "@privy-io/react-auth";
import { toast } from "react-toastify";
import { saveToLocalStorage } from "../../../../utils";
import * as Sentry from "@sentry/react";

const TopbarSection = () => {
  const { openedLoginModal, posthog, setText, setIsLoading } =
    useContext(Context);
  const { isAuthenticated } = useAppAuth();
  const { chain } = useAccount();
  const { logout } = usePrivy();
  const { disconnect } = useDisconnect();

  const { mutateAsync: evmAuthAsync } = useMutation({
    mutationKey: "evmAuth",
    mutationFn: evmAuth,
  });

  const { login } = useLogin({
    onComplete: (
      user,
      isNewUser,
      wasAlreadyAuthenticated,
      loginMethod,
      linkedAccount
    ) => {
      console.log("user");
      console.log(
        user,
        isNewUser,
        wasAlreadyAuthenticated,
        loginMethod,
        linkedAccount
      );
      // Any logic you'd like to execute if the user is/becomes authenticated while this
      // component is mounteds

      evmAuthAsync({
        walletAddress: user.wallet.address,
      }).then((res) => {
        toast.success("Login successful");
        saveToLocalStorage(LOCAL_STORAGE.evmAuth, true);
        saveToLocalStorage(LOCAL_STORAGE.userAuthToken, res.jwt);
        saveToLocalStorage(LOCAL_STORAGE.userAuthTime, new Date().getTime());
        saveToLocalStorage(LOCAL_STORAGE.userAddress, user.wallet.address);
        saveToLocalStorage(LOCAL_STORAGE.lensAuth, {
          profileId: res?.profileId,
          profileHandle: res?.profileHandle,
        });
        saveToLocalStorage(LOCAL_STORAGE.userId, res?.userId);
        Sentry.setUser({
          id: res?.userId,
        });
        setSession(res.jwt);

        posthog.identify(res?.userId, {
          evm_address: address,
        });
      });
    },
    onError: (error) => {
      console.log("error by privy");
      console.log(error);
      toast.error("Something went wrong");
      logout();
      disconnect();
      setIsLoading(false);
      setText("");
    },
  });

  const isSupportedChain = () => {
    if (ENVIRONMENT === "production") {
      if (chain?.id === 137) return true;
    } else {
      if (chain?.id === 80001) return true;
    }
  };

  return (
    <>
      <div className="bg-white mb-2 w-full px-3 py-2 sm:overflow-x-auto sm:overflow-y-hidden sm:max-w-[100vw] sticky border">
        <div className="flex items-center justify-between">
          <Logo />

          {!isAuthenticated && (
            <>
              <div className="hidden md:flex items-center gap-3">
                <Typography className="font-semibold text-lg">
                  Login with
                </Typography>
                <SolanaWallets title="Solana" />
                <EVMWallets title="EVM" login={login} />
              </div>
              <MobileLoginBtn />
            </>
          )}

          {isAuthenticated ? (
            <div className="flex items-center justify-center space-x-4 md:space-x-6">
              {/* Discord Links - 19Jul2023 */}
              <a
                className="md:w-8 h-8 text-gray-600 md:flex hidden transition-transform transform-gpu hover:scale-125 hover:rotate-180 hover:duration-2000"
                target="_blank"
                href="https://discord.gg/yHMXQE2DNb"
              >
                <img src="/topbar-icons/iconDiscord.svg" alt="" />
              </a>

              <div id="fifth-step">
                <ShareButton />
              </div>
              <div>
                <DownloadBtn />
              </div>
              <div className="" id="first-step">
                {/* <ProfileMenu /> */}
                <PointsBtn />
              </div>
            </div>
          ) : null}
        </div>
      </div>
      {openedLoginModal && <LoginModal />}
    </>
  );
};

export default TopbarSection;
