import { useQuery } from "@tanstack/react-query";
import { useAppAuth, useLocalStorage } from "../app";
import { getUserPoints, getUserProfile } from "../../services/apis/BE-apis";
import { getFarcasterDetails, getProfileImage } from "../../services";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { consoleLogonlyDev, getFromLocalStorage } from "../../utils";
import { LOCAL_STORAGE } from "../../data";

const useUser = () => {
  const [userLevel, setUserLevel] = useState("Normie");
  const { userId } = useLocalStorage();
  const address = getFromLocalStorage("user.address");
  const { isAuthenticated } = useAppAuth();
  const { data, error, isError, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: getUserProfile,
    enabled: isAuthenticated ? true : false,
    refetchOnMount: false,
    // cache it
    cacheTime: 1000 * 60 * 60 * 24 * 7,
  });

  const { data: farcasterData, error: farcasterError } = useQuery({
    queryKey: ["farcasterDetails"],
    queryFn: () => getFarcasterDetails(address),
    enabled: address ? true : false,
    refetchOnMount: false,
    // cache it
    cacheTime: 1000 * 60 * 60 * 24 * 7,
  });

  const { data: pointsData, error: pointsError } = useQuery({
    queryKey: ["userPoints"],
    queryFn: () => getUserPoints(address),
    enabled: address ? true : false,
    refetchOnMount: false,
  });

  const fnGetUserLevel = async () => {
    if (pointsData?.data?.totalPoints < 500) {
      setUserLevel("Normie");
    }
    if (pointsData?.data?.totalPoints >= 500) {
      setUserLevel("Pleb");
    } else if (pointsData?.data?.totalPoints >= 1000) {
      setUserLevel("Chad");
    }
  };

  useEffect(() => {
    fnGetUserLevel();
  }, [data, address]);

  return {
    address,
    username: data?.username || getFromLocalStorage(LOCAL_STORAGE.username),
    email: data?.mail,
    lensHandle: data?.lens_handle,
    farcasterHandle: farcasterData?.Social?.[0]?.profileHandle,
    points: data?.points,
    profileImage:
      farcasterData?.Social?.[0]?.profileImage ||
      getFromLocalStorage(LOCAL_STORAGE.userProfileImage),
    error,
    isError,
    isLoading,
    userLevel,
  };
};

export default useUser;
