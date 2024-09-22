import { LOCAL_STORAGE } from "../../data";

// hook for local storage to retrieve the data
const useLocalStorage = () => {
  const getFromLocalStorage = (key) => {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) return undefined;
      return JSON.parse(serializedValue);
    } catch (e) {
      console.log(e);
      return undefined;
    }
  };

  const authToken = getFromLocalStorage(LOCAL_STORAGE.userAuthToken);
  const evmAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);
  const solanaAuth = getFromLocalStorage(LOCAL_STORAGE.solanaAuth);
  const isFarcasterAuth = getFromLocalStorage(LOCAL_STORAGE.farcasterAuth);
  const userAuthTime = getFromLocalStorage(LOCAL_STORAGE.userAuthTime);
  const lensAuth = getFromLocalStorage(LOCAL_STORAGE.lensAuth);
  const ifUserEligible = getFromLocalStorage(LOCAL_STORAGE.ifUserEligible);
  const hasUserSeenTheApp = getFromLocalStorage(
    LOCAL_STORAGE.hasUserSeenTheApp
  );
  const dispatcher = getFromLocalStorage(LOCAL_STORAGE.dispatcher);
  const userGuideTour = getFromLocalStorage(LOCAL_STORAGE.userGuideTour);
  const braveShieldWarn = getFromLocalStorage(LOCAL_STORAGE.braveShieldWarn);
  const userId = getFromLocalStorage(LOCAL_STORAGE.userId);
  const isWatermark = getFromLocalStorage(LOCAL_STORAGE.isWatermark);
  const userLOA = getFromLocalStorage(LOCAL_STORAGE.userLOA);
  const fcComposerAuth = getFromLocalStorage(LOCAL_STORAGE.FcComposerAuth);
  const actionType = getFromLocalStorage(LOCAL_STORAGE.actionType);
  const userAddress = getFromLocalStorage(LOCAL_STORAGE.userAddress);

  return {
    authToken,
    evmAuth,
    solanaAuth,
    isFarcasterAuth,
    userAuthTime,
    lensAuth,
    ifUserEligible,
    hasUserSeenTheApp,
    dispatcher,
    userGuideTour,
    braveShieldWarn,
    userId,
    isWatermark,
    userLOA,
    fcComposerAuth,
    actionType,
    userAddress,
  };
};

export default useLocalStorage;
