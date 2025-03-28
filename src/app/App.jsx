import { useContext, useEffect, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import {
  refreshNFT,
  solanaAuth,
  evmAuth,
} from "../services/apis/BE-apis/backendApi";
import { getFromLocalStorage, saveToLocalStorage } from "../utils/localStorage";
import { ToastContainer, toast } from "react-toastify";
import { Context } from "../providers/context/ContextProvider";
import { useNavigate } from "react-router-dom";

import Editor from "./editor/Editor";
import {
  CheckInternetConnection,
  LoadingComponent,
  UpdateAvailable,
} from "./editor/common";
import { errorMessage } from "../utils";
import { useSolanaWallet } from "../hooks/solana";
import { useMutation } from "@tanstack/react-query";
import { ERROR, LOCAL_STORAGE, SOLANA_MESSAGE } from "../data";
import bs58 from "bs58";
import { SolanaWalletErrorContext } from "../providers/solana/SolanaWalletProvider";
import { useLocalStorage, useLogout } from "../hooks/app";
import * as Sentry from "@sentry/react";

import FrameSDK from "@farcaster/frame-sdk";
import farcasterFrame from "@farcaster/frame-wagmi-connector";
import { connect } from "wagmi/actions";
import { config } from "../providers/EVM/EVMWalletProvider";

const App = () => {
  const {
    isLoading,
    setIsLoading,
    text,
    setText,
    posthog,
    session,
    setSession,
    setActionType,
    setIsMobile,
    setOpenLeftBar,
  } = useContext(Context);
  const { address } = useAccount();
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const getSolanaAuth = getFromLocalStorage(LOCAL_STORAGE.solanaAuth);
  const getifUserEligible = getFromLocalStorage(LOCAL_STORAGE.ifUserEligible);
  const getHasUserSeenTheApp = getFromLocalStorage(
    LOCAL_STORAGE.hasUserSeenTheApp
  );
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
  const { userAuthTime: jwtTimestamp, authToken } = useLocalStorage();
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);

  // clear the session if it is expired (24hrs)
  useEffect(() => {
    const actionType = params.get("actionType");

    if (actionType === "composer" || !authToken) return;

    const clearLocalStorage = () => {
      console.log("checking session");
      const jwtExpiration = 24 * 60 * 60 * 1000 - 5 * 60 * 1000; // 24 hours minus 5 minutes in milliseconds
      const currentTimestamp = Date.now(); // Use Date.now() for better performance

      if (jwtTimestamp && currentTimestamp - jwtTimestamp > jwtExpiration) {
        logout();
        setSession("");
        console.log("session expired");
        toast.error("Session expired");
      }
    };

    const interval = setInterval(clearLocalStorage, 30 * 1000); // check every 60 seconds

    return () => clearInterval(interval);
  }, [authToken, jwtTimestamp, params]); // Added dependencies for better effect management

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

  // get the fc auth for composer action
  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    const actionType = params.get("actionType");
    const userAddress = params.get("address");
    const authParam = params.get("fc-auth");
    const fid = params.get("fid");
    saveToLocalStorage(LOCAL_STORAGE.FcComposerAuth, authParam);
    saveToLocalStorage(LOCAL_STORAGE.userAddress, userAddress);
    saveToLocalStorage(LOCAL_STORAGE.fid, fid);
    setActionType(actionType);

    posthog.identify(fid, {
      evm_address: userAddress,
    });
  }, []);

  // Logic to Set isMobile variable
  useEffect(() => {
    if (window.innerWidth < 880) {
      setIsMobile(true);
      setOpenLeftBar(true);
    }
    if (window.innerWidth > 880) {
      setIsMobile(false);
    }
  }, [window.innerWidth]);

  return (
    <>
      <FarcasterFrameProvider>
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
      </FarcasterFrameProvider>
    </>
  );
};

export default App;

function FarcasterFrameProvider({ children }) {
  useEffect(() => {
    const init = async () => {
      const context = await FrameSDK.context;

      // Autoconnect if running in a frame.
      if (context?.client.clientFid) {
        connect(config, { connector: farcasterFrame() });
      }

      // acount address
      const connectedAddress = await FrameSDK.wallet.ethProvider.request({
        method: "eth_requestAccounts",
      });

      saveToLocalStorage(
        LOCAL_STORAGE.FcComposerAuth,
        `FC frames-v2 ${context?.user?.fid} ${connectedAddress[0]}`
      );
      saveToLocalStorage(LOCAL_STORAGE.userAddress, connectedAddress[0]);
      saveToLocalStorage(LOCAL_STORAGE.fid, context?.user?.fid);

      // Hide splash screen after UI renders.
      setTimeout(() => {
        FrameSDK.actions.ready();

        // add frame
        FrameSDK.actions?.addFrame();

        // FrameSDK?.actions?.signIn({ nouns: "sdfkjhesuic" });
      }, 500);
    };
    init();
  }, []);

  return <>{children}</>;
}
