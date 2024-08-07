import { useContext, useEffect, useState } from "react";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";
import {
  refreshNFT,
  solanaAuth,
  evmAuth,
} from "../services/apis/BE-apis/backendApi";
import {
  getFromLocalStorage,
  saveToLocalStorage,
  removeFromLocalStorage,
} from "../utils/localStorage";
import { ToastContainer, toast } from "react-toastify";
import { Context } from "../providers/context/ContextProvider";
import { useNavigate } from "react-router-dom";
import { useTour } from "@reactour/tour";

import Editor from "./editor/Editor";
import {
  BraveShieldWarn,
  CheckInternetConnection,
  LoadingComponent,
  OnboardingSteps,
  OnboardingStepsWithShare,
  UpdateAvailable,
} from "./editor/common";
import { clearAllLocalStorageData, errorMessage } from "../utils";
import { useSolanaWallet } from "../hooks/solana";
import { useMutation } from "@tanstack/react-query";
import { ERROR, EVM_MESSAGE, LOCAL_STORAGE, SOLANA_MESSAGE } from "../data";
import bs58 from "bs58";
import { ExplorerDialog } from "./editor/sections/right-section/share/components";
import { ENVIRONMENT } from "../services";
import { SolanaWalletErrorContext } from "../providers/solana/SolanaWalletProvider";
import { useLogout } from "../hooks/app";
import { useStore } from "../hooks/polotno";
import * as Sentry from "@sentry/react";

const App = () => {
  const { setSteps, setIsOpen, setCurrentStep } = useTour();
  const [initialRender, setInitialRender] = useState(true);
  const {
    isLoading,
    setIsLoading,
    text,
    setText,
    posthog,
    dialogOpen,
    explorerLink,
    handleOpen,
    session,
    setSession,

    setIsMobile,
    setOpenLeftBar,
  } = useContext(Context);
  const [sign, setSign] = useState("");
  const { address, isConnected, isDisconnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const getEvmAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);
  const getSolanaAuth = getFromLocalStorage(LOCAL_STORAGE.solanaAuth);
  const getUserAuthToken = getFromLocalStorage(LOCAL_STORAGE.userAuthToken);
  const getUserAddress = getFromLocalStorage(LOCAL_STORAGE.userAddress);
  const getUsertAuthTmestamp = getFromLocalStorage(LOCAL_STORAGE.userAuthTime);
  const getifUserEligible = getFromLocalStorage(LOCAL_STORAGE.ifUserEligible);
  const isBraveShieldWarn = getFromLocalStorage(LOCAL_STORAGE.braveShieldWarn);
  const getHasUserSeenTheApp = getFromLocalStorage(
    LOCAL_STORAGE.hasUserSeenTheApp
  );
  const navigate = useNavigate();
  const {
    solanaConnected,
    solanaSignMessage,
    solanaAddress,
    solanaDisconnect,
  } = useSolanaWallet();
  const [solanaSignature, setSolanaSignature] = useState("");
  const { solanaWalletError, setSolanaWalletError } = useContext(
    SolanaWalletErrorContext
  );
  const { logout } = useLogout();

  // clear the session if it is expired (24hrs)
  useEffect(() => {
    const clearLocalStorage = () => {
      if (getUserAuthToken === undefined) return;

      console.log("checking session");
      const jwtExpiration = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
      const jwtTimestamp = getFromLocalStorage(LOCAL_STORAGE.userAuthTime);

      const currentTimestamp = new Date().getTime();

      if (jwtTimestamp && currentTimestamp - jwtTimestamp > jwtExpiration) {
        logout();
        setSession("");
        console.log("session expired");
        toast.error("Session expired");

        // TODO: clear all local storage data + states
      }
    };

    const interval = setInterval(clearLocalStorage, 15 * 1000); // check every 15 seconds

    return () => clearInterval(interval);
  }, []);

  // generate signature for solana
  const generateSignatureSolana = async () => {
    saveToLocalStorage(LOCAL_STORAGE.hasUserSeenTheApp, true);

    if (getSolanaAuth) {
      return setSession(getUserAuthToken);
    } else if (solanaConnected) {
      setIsLoading(true);
      setText("Sign the message to login");

      // pass the message as Uint8Array
      const message = new TextEncoder().encode(SOLANA_MESSAGE);
      const signature = await solanaSignMessage(message);

      // convert the signature to base58
      const signatureBase58 = bs58.encode(signature);
      setSolanaSignature(signatureBase58);
    }
  };

  // Solana login
  const { mutateAsync: solanaAuthAsync } = useMutation({
    mutationKey: "solanaAuth",
    mutationFn: solanaAuth,
  });

  // Solana auth handler
  const solanaAuthHandler = async () => {
    setIsLoading(true);
    setText("Logging in...");
    await solanaAuthAsync({
      walletAddress: solanaAddress,
      signature: solanaSignature,
      message: SOLANA_MESSAGE,
    })
      .then((res) => {
        if (res?.status === "success") {
          setIsLoading(false);
          setText("");
          toast.success("Login successful");
          saveToLocalStorage(LOCAL_STORAGE.solanaAuth, true);
          saveToLocalStorage(LOCAL_STORAGE.userAuthToken, res.jwt);
          saveToLocalStorage(LOCAL_STORAGE.userAuthTime, new Date().getTime());
          saveToLocalStorage(LOCAL_STORAGE.userAddress, solanaAddress);
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
            solana_address: solanaAddress,
          });
        } else {
          toast.error(ERROR.SOMETHING_WENT_WRONG);
          solanaDisconnect();
          setIsLoading(false);
          setText("");
          toast.error(res);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(errorMessage(err));
        solanaDisconnect();
        setIsLoading(false);
        setText("");
      });
  };

  // update nfts for EVM + Solana
  const { mutate: updateNft } = useMutation({
    mutationKey: "refreshNFT",
    mutationFn: refreshNFT,
    onSuccess: (res) => {
      console.log(res?.message);
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const isUserEligible = () => {
    if (
      getifUserEligible &&
      getifUserEligible.address === address &&
      getifUserEligible.isUserEligible === true
    ) {
      return true;
    } else if (getHasUserSeenTheApp && getHasUserSeenTheApp === true) {
      return true;
    } else {
      return false;
    }
  };

  // useEffect(() => {
  //   // if false redirect to ifUserEligible page but only in production
  //   if (ENVIRONMENT === "production") {
  //     if (!isUserEligible()) {
  //       navigate("/ifUserEligible");
  //     }
  //   }
  // }, []);

  useEffect(() => {
    if (solanaWalletError.isError) {
      saveToLocalStorage(LOCAL_STORAGE.hasUserSeenTheApp, true);
      solanaDisconnect();
      setIsLoading(false);
      toast.error(solanaWalletError.message);

      setTimeout(() => {
        setSolanaWalletError({
          isError: false,
          name: "",
          message: "",
        });
      }, 2000);
    }
  }, [solanaWalletError.isError]);

  useEffect(() => {
    if (session) {
      updateNft();
    }
  }, [session]);

  useEffect(() => {
    if (solanaSignature) {
      solanaAuthHandler();
    }
  }, [solanaSignature]);

  // useEffect(() => {
  // // Run the effect when isConnected and address change
  //   if (isConnected && address) {
  //     generateSignature();
  //   }
  // }, [isConnected, address, initialRender]);

  useEffect(() => {
    // Run the effect when solanaConnected and solanaAddress change
    if (solanaConnected && solanaAddress) {
      generateSignatureSolana();
    }
  }, [solanaConnected, solanaAddress]);

  // check for updates
  useEffect(() => {
    const registration = navigator.serviceWorker;
    if (!registration) return;

    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed") {
          if (navigator.serviceWorker.controller) {
            console.log("New update available");
            setIsUpdateAvailable(true);
          }
        }
      });
    });
  }, []);

  // Logic to Set isMobile variable
  useEffect(() => {
    if (window.innerWidth < 768) {
      setIsMobile(true);
      setOpenLeftBar(true);
    }
    if (window.innerWidth > 768) {
      setIsMobile(false);
    }
  }, [window.innerWidth, window.innerHeight]);

  // get the fc auth for composer action
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const authParam = params.get("fc-auth");
    const actionType = params.get("actionType");
    const userAddress = params.get("address");
    saveToLocalStorage(LOCAL_STORAGE.FcComposerAuth, authParam);
    saveToLocalStorage(LOCAL_STORAGE.actionType, actionType);
    saveToLocalStorage(LOCAL_STORAGE.userAddress, userAddress);
  }, []);

  return (
    <>
      <Editor />
      {/* {window.navigator?.brave && !isBraveShieldWarn && <BraveShieldWarn />} */}
      {isUpdateAvailable && <UpdateAvailable />}
      <CheckInternetConnection />
      <LoadingComponent isLoading={isLoading} text={text} />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
};

export default App;
