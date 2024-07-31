import { LOCAL_STORAGE } from "../data";
import { removeFromLocalStorage } from "./localStorage";

// remove all data from localstorage

export const clearAllLocalStorageData = () => {
  removeFromLocalStorage(LOCAL_STORAGE.userAuthToken);
  removeFromLocalStorage(LOCAL_STORAGE.evmAuth);
  removeFromLocalStorage(LOCAL_STORAGE.solanaAuth);
  removeFromLocalStorage(LOCAL_STORAGE.userAuthTime);
  removeFromLocalStorage(LOCAL_STORAGE.userAddress);
  removeFromLocalStorage(LOCAL_STORAGE.lensAuth);
  removeFromLocalStorage(LOCAL_STORAGE.ifUserEligible);
  removeFromLocalStorage(LOCAL_STORAGE.dispatcher);
  removeFromLocalStorage(LOCAL_STORAGE.actionType);
  removeFromLocalStorage(LOCAL_STORAGE.farcasterAuth);
  removeFromLocalStorage(LOCAL_STORAGE.privy);
  removeFromLocalStorage(LOCAL_STORAGE.FcComposerAuth);
};
