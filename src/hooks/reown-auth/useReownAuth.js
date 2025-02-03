import { useCallback, useContext, useEffect, useState } from "react";
import { Context } from "../../providers/context";
import { useSignMessage } from "wagmi";
import { useMutation } from "@tanstack/react-query";
import { evmAuth, solanaAuth } from "../../services";
import { toast } from "react-toastify";
import { getFromLocalStorage, saveToLocalStorage } from "../../utils";
import { LOCAL_STORAGE } from "../../data";
import * as Sentry from "@sentry/react";
import useAppUrl from "../app/useAppUrl";
import {
  useAppKit,
  useAppKitAccount,
  useAppKitProvider,
  useWalletInfo,
} from "@reown/appkit/react";
import base58 from "bs58";
import { useLogout } from "../app";

const useReownAuth = () => {
  const { open: openReown, close: closeReown } = useAppKit();
  const {
    posthog,
    setText,
    setIsLoading,
    setSession,
    isLoggedOut,
    setIsLoggedOut,
    setOpenedLoginModal,
    showSignMessageModal,
    setShowSignMessageModal,
  } = useContext(Context);
  const { walletInfo } = useWalletInfo();
  const { logout } = useLogout();
  const { urlQueryActionType } = useAppUrl();
  const { signMessageAsync } = useSignMessage();
  const [signature, setSignature] = useState("");
  const [isSolana, setIsSolana] = useState(false);
  const { address, caipAddress, isConnected, status, embeddedWalletInfo } =
    useAppKitAccount();
  const evmConnected = getFromLocalStorage(LOCAL_STORAGE.evmConnected);
  const { walletProvider } = useAppKitProvider("solana");

  const isAuthenticated = isConnected && address;

  //console.log('useAppKitAccount', { address, caipAddress, signature, walletInfo, isConnected, status, evmConnected })

  const { mutateAsync: evmAuthAsync } = useMutation({
    mutationKey: "evmAuth",
    mutationFn: evmAuth,
  });

  const { mutateAsync: solanaAuthAsync } = useMutation({
    mutationKey: "solanaAuth",
    mutationFn: solanaAuth,
  });

  async function onSolanaSignMessage() {
    try {
      if (!walletProvider || !address) {
        throw Error("User is disconnected");
      }
      const encodedMessage = new TextEncoder().encode(
        "Sign the message to login"
      );
      const signatureBuffer = await walletProvider.signMessage(encodedMessage);
      const signatureBase58 = base58.encode(signatureBuffer);
      if (signatureBase58) {
        setSignature(signatureBase58);
        setShowSignMessageModal(false);
        setIsLoggedOut(false);
      }
    } catch (err) {
      console.error("Solana: Signature error:", err);
      toast.error("Solana: Failed to sign message");
      setShowSignMessageModal(false);
      setIsLoggedOut(false);
      logout();
    }
  }

  const handleSignEvmMessage = async () => {
    try {
      const signature = await signMessageAsync({
        message: "Sign the message to login",
      });
      if (signature) {
        setSignature(signature);
        setShowSignMessageModal(false);
        setIsLoggedOut(false);
      }
    } catch (error) {
      console.error("EVM: Signature error:", error);
      toast.error("EVM: Failed to sign message");
      setShowSignMessageModal(false);
      setIsLoggedOut(false);
      logout();
    }
  };

  const handleSignMessage = async () => {
    if (caipAddress?.startsWith("solana:") && isSolana) {
      return await onSolanaSignMessage();
    } else {
      return await handleSignEvmMessage();
    }
    return;
  };

  useEffect(() => {
    if (address && isConnected) {
      console.log("address", address);
      console.log("isConnected", isConnected);
      if (!evmConnected) {
        saveToLocalStorage(LOCAL_STORAGE.evmConnected, true);
      }
    } else {
      setSignature("");
      setIsSolana(false);
      saveToLocalStorage(LOCAL_STORAGE.evmConnected, false);
    }
  }, [address, isConnected, isLoggedOut]);

  useEffect(() => {
    const initializeSignature = async () => {
      // Add a check for an ongoing signature request
      if (signature || !address || !isConnected) return;

      // Only proceed if we have an explicit evmConnected=true in localStorage
      // AND we have a valid auth token
      const isExplicitlyConnected =
        getFromLocalStorage(LOCAL_STORAGE.evmConnected) === true;
      const hasValidAuth = getFromLocalStorage(LOCAL_STORAGE.userAuthToken);

      if (isExplicitlyConnected && !hasValidAuth) {
        if (caipAddress?.startsWith("solana:")) {
          setIsSolana(true);
          //return await onSolanaSignMessage()
          //   setShowSignMessageModal(true);
        } else {
          setIsSolana(false);
          //return await handleSignMessage()
          //   setShowSignMessageModal(true);
        }
      }
    };

    // Debounce the signature request
    const timeoutId = setTimeout(initializeSignature, 500);
    return () => clearTimeout(timeoutId);
  }, [address, isConnected, signature, caipAddress]); // Remove evmConnected from dependencies

  useEffect(() => {
    if (signature && evmConnected) {
      handleLogin();
    }
  }, [signature, evmConnected]);

  const handleLogin = useCallback(async () => {
    if (signature && address && isConnected) {
      //console.log('Debug login values:', { signature, address, isConnected, isSolana }) // Add debug logging

      if (!address) {
        //console.error('No wallet address available')
        toast.error("Wallet address not found");
        return;
      }
      const asyncRequest = isSolana ? solanaAuthAsync : evmAuthAsync;
      let request = {
        signature: signature,
        walletAddress: address,
      };
      if (isSolana) {
        request.message = "Sign the message to login";
      }

      //console.log('Request payload:', request)
      try {
        asyncRequest(request).then((res) => {
          //console.log('res', res)
          toast.success(
            `${
              urlQueryActionType === "composer"
                ? "Wallet connected"
                : "Login successful"
            }`
          );
          if (isSolana) {
            saveToLocalStorage(LOCAL_STORAGE.solanaAuth, true);
          }
          saveToLocalStorage(LOCAL_STORAGE.evmAuth, true);
          saveToLocalStorage(LOCAL_STORAGE.userAuthToken, res.jwt);
          saveToLocalStorage(LOCAL_STORAGE.userAuthTime, new Date().getTime());
          saveToLocalStorage(LOCAL_STORAGE.userAddress, address);
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
          closeReown();
          posthog.identify(res?.userId, {
            evm_address: address,
          });
        });
      } catch (error) {
        //console.log('error by auth endpoint')
        //console.log(error)
        toast.error("Something went wrong");
        logout();
        closeReown();
        setIsLoading(false);
        setOpenedLoginModal(false);
        setText("");
      }
    } else {
      //console.log('error by reown')
      toast.error("Something went wrong");
      closeReown();
      logout();
      setIsLoading(false);
      setOpenedLoginModal(false);
      setText("");
    }
  }, [signature, address, isConnected, isSolana]);

  const login = useCallback(() => {
    openReown("AllWallets");
  }, [openReown]);

  const handleDisconnectWallet = () => {
    logout();
    closeReown();
    setIsLoading(false);
    setOpenedLoginModal(false);
    setShowSignMessageModal(false);
    setIsLoggedOut(false);
    setText("");
  };

  return {
    login,
    isAuthenticated,
    address,
    caipAddress,
    handleDisconnectWallet,
    handleSignMessage,
    // for reown auth
    openReown,
    closeReown,
  };
};

export default useReownAuth;
