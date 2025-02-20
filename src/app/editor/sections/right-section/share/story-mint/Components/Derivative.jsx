import { useContext } from "react";
import { Context } from "../../../../../../../providers/context";
import { useAppAuth, useReset } from "../../../../../../../hooks/app";
import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  registerIPDerivative,
  uploadUserAssetToIPFS,
} from "../../../../../../../services";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { useEffect } from "react";
import {
  addressCrop,
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../../../../../../utils";
import { LOCAL_STORAGE } from "../../../../../../../data";
import { InputBox, SelectBox } from "../../../../../common";
import { EVMWallets } from "../../../../top-section/auth/wallets";
import { Button, Textarea } from "@material-tailwind/react";
import { getOrCreateWallet } from "../../../../../../../services/apis/BE-apis";
import { Topup } from "../../farcaster-share/components";
import WithdrawFunds from "../../farcaster-share/components/WithdrawFunds";
import WatermarkRemover from "../../components/WatermarkRemover";
import { storyAeneidTestnet } from "../../../../../../../data";
import usePrivyAuth from "../../../../../../../hooks/privy-auth/usePrivyAuth";

const Derivative = () => {
  const {
    postDescription,
    contextCanvasIdRef,
    actionType,
    canvasBase64Ref,
    storyIPDataRef,
    setPostDescription,
    isMobile,
  } = useContext(Context);

  const { resetState } = useReset();
  const { login } = usePrivyAuth();
  const { isAuthenticated } = useAppAuth();
  const { address, isConnected } = useAccount();
  const [creatorName, setCreatorName] = useState("");
  const [creatorDescription, setCreatorDescription] = useState("");
  const [twitter, setTwitter] = useState("");
  const [farcaster, setFarcaster] = useState("");
  const [charLimitError, setCharLimitError] = useState("");
  const [collectionName, setCollectionName] = useState("");
  const getEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);

  const {
    data: walletData,
    isError: isWalletError,
    isLoading: isWalletLoading,
    error: walletError,
    isSuccess: isWalletSuccess,
    refetch: refetchWallet,
    isRefetching: isWalletRefetching,
  } = useQuery({
    queryKey: ["getOrCreateWallet"],
    queryFn: () => getOrCreateWallet(storyAeneidTestnet?.id),
    refetchOnWindowFocus: false,
  });

  // upload to IPFS Mutation
  const {
    mutate,
    data: uploadData,
    isError: isUploadError,
    error: uploadError,
    isSuccess: isUploadSuccess,
    isLoading: isUploading,
    isPending: isUploadPending,
  } = useMutation({
    mutationKey: "uploadToIPFS",
    mutationFn: uploadUserAssetToIPFS,
  });

  // upload JSON to IPFS Mutation
  const {
    mutate: registerDerivative,
    data: registerDerivativeData,
    isError: isRegisterDerivativeError,
    error: registerDerivativeError,
    isSuccess: isRegisterDerivativeSuccess,
    isLoading: isRegisterDerivativeLoading,
    isPending: isRegisterDerivativePending,
  } = useMutation({
    mutationKey: "registerIPDerivative",
    mutationFn: registerIPDerivative,
  });

  useEffect(() => {
    if (isWalletSuccess) {
      saveToLocalStorage(LOCAL_STORAGE.userLOA, walletData?.publicAddress);
    }
  }, [isWalletSuccess]);

  // upload JSON data to IPFS
  useEffect(() => {
    if (uploadData?.message) {
      let jsonData = {
        title: collectionName,
        description: postDescription,
        mintFeeRecipient: address,
        images: [`ipfs://${uploadData?.message}`],
        metadata: {
          title: collectionName,
          description: postDescription,
          creators: {
            name: creatorName,
            bio: creatorDescription,
            socialMedia: [
              {
                platform: "twitter",
                url: twitter,
              },
              {
                platform: "farcaster",
                url: farcaster,
              },
            ],
          },
        },
        parentIpIds: [...storyIPDataRef.current.map((item) => item?.ipID)],
        licenseTermsIds: [
          ...storyIPDataRef.current.map((item) => item?.licenseTermsId),
        ],
      };
      registerDerivative(jsonData);
    }
  }, [isUploadSuccess]);

  useEffect(() => {
    if (isRegisterDerivativeError) {
      toast.error(registerDerivativeError?.message);
    }
  }, [isRegisterDerivativeError, registerDerivativeError]);

  useEffect(() => {
    if (isUploadError) {
      toast.error(uploadError?.message);
    }
  }, [isUploadError, uploadError]);

  useEffect(() => {
    if (isRegisterDerivativeSuccess) {
      //resetState()
      toast.success("Derivative registered successfully!");
    }
  }, [isRegisterDerivativeSuccess]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const maxByteLimit = 195;
    const byteLength = new TextEncoder().encode(value).length;

    if (name === "title") {
      setCollectionName(value);
      if (isMobile) {
        setCollectionName("Default Title");
      }
    } else if (name === "creatorName") {
      setCreatorName(value);
      if (isMobile) {
        setCreatorName("Default Creator Name");
      }
    } else if (name === "creatorDescription") {
      setCreatorDescription(value);
      if (isMobile) {
        setCreatorDescription("Default Creator Description");
      }
    } else if (name === "twitter") {
      setTwitter(value);
      if (isMobile) {
        setTwitter("Default Twitter");
      }
    } else if (name === "farcaster") {
      setFarcaster(value);
      if (isMobile) {
        setFarcaster("Default Farcaster");
      }
    } else if (name === "description") {
      if (byteLength > maxByteLimit) {
        setCharLimitError("Maximun character limit exceeded");
        setPostDescription(
          value.substring(0, value.length - (byteLength - maxByteLimit))
        );
      } else {
        setCharLimitError("");
        setPostDescription(value);
      }
    }
  };

  const handleSubmit = () => {
    if (!address) {
      toast.error("Please connect your wallet");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Please login to continue");
      return;
    }

    if (!isConnected) {
      toast.error("Please connect your wallet");
      return;
    }

    if (contextCanvasIdRef.current === null) {
      toast.error("Please select a design");
      return;
    }

    if (storyIPDataRef.current.length === 0) {
      toast.error("Please add asset to the design");
      return;
    }
    if (!collectionName) {
      // check if collection name is provided
      toast.error("Please provide a collection name");
      return;
    }

    // check if collection symbol is provided
    if (!creatorName) {
      toast.error("Please provide a creator name");
      return;
    }

    // check if creator description is provided
    if (!creatorDescription) {
      toast.error("Please provide a creator description");
      return;
    }

    // check if description is provided
    if (!postDescription) {
      toast.error("Please provide a description");
      return;
    }

    // upload to IPFS
    mutate(canvasBase64Ref.current[0]);
  };

  const isPending = isUploadPending || isRegisterDerivativePending;

  const isLoading = isUploading || isRegisterDerivativeLoading || isPending;

  return (
    <div>
      <div className=" mt-1 pt-2 pb-4">
        <div className="flex justify-between">
          <h2 className="text-lg"> Register as Derivative </h2>
        </div>
      </div>

      <div className="flex flex-col w-full gap-3">
        <div className="flex flex-col gap-2">
          <h3 className="text-md">Derivative Details</h3>
          <div className="flex flex-col w-full">
            <InputBox
              label="Name"
              name="title"
              disabled={isLoading}
              onChange={(e) => handleInputChange(e)}
              onFocus={(e) => handleInputChange(e)}
              value={collectionName}
            />
            <div className="mt-4">
              {!isMobile ? (
                <Textarea
                  label="Description"
                  name="description"
                  disabled={isLoading}
                  onChange={(e) => handleInputChange(e)}
                  onFocus={(e) => handleInputChange(e)}
                  value={postDescription}
                />
              ) : (
                <textarea
                  cols={30}
                  type="text"
                  disabled={isLoading}
                  className="border border-b-2 border-blue-gray-700 w-full mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
                  label="Description"
                  name="description"
                  onChange={(e) => handleInputChange(e)}
                  onFocus={(e) => handleInputChange(e)}
                  value={postDescription}
                  placeholder="Write a description..."
                  // className="border border-b-4 w-full h-40 mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
                />
              )}
              {charLimitError && (
                <div className="text-red-500 text-sm">{charLimitError}</div>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-md">Creator Details</h3>
          <div className="flex flex-col w-full">
            <InputBox
              label="Creator Name"
              name="creatorName"
              disabled={isLoading}
              onChange={(e) => handleInputChange(e)}
              onFocus={(e) => handleInputChange(e)}
              value={creatorName}
            />
            <div className="mt-4">
              {!isMobile ? (
                <Textarea
                  label="Creator Description"
                  name="creatorDescription"
                  disabled={isLoading}
                  onChange={(e) => handleInputChange(e)}
                  onFocus={(e) => handleInputChange(e)}
                  value={creatorDescription}
                />
              ) : (
                <textarea
                  cols={30}
                  type="text"
                  className="border border-b-2 border-blue-gray-700 w-full mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
                  label="Creator Description"
                  name="creatorDescription"
                  onChange={(e) => handleInputChange(e)}
                  onFocus={(e) => handleInputChange(e)}
                  value={creatorDescription}
                  disabled={isLoading}
                  placeholder="Write a description..."
                  // className="border border-b-4 w-full h-40 mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
                />
              )}
              {charLimitError && (
                <div className="text-red-500 text-sm">{charLimitError}</div>
              )}
            </div>
            <div className="flex mt-2s">
              <InputBox
                label="Twitter"
                name="twitter"
                disabled={isLoading}
                onChange={(e) => handleInputChange(e)}
                onFocus={(e) => handleInputChange(e)}
                value={twitter}
              />
            </div>
            <div className="flex mt-4">
              <InputBox
                label="Farcaster"
                name="farcaster"
                disabled={isLoading}
                onChange={(e) => handleInputChange(e)}
                onFocus={(e) => handleInputChange(e)}
                value={farcaster}
              />
            </div>
          </div>
        </div>
      </div>
      {isRegisterDerivativeSuccess &&
      registerDerivativeData?.data?.collection ? (
        <div className="flex flex-col gap-2 mt-4 justify-center items-center">
          <p className="text-green-500 font-bold">
            Derivative registered successfully!
          </p>
          <a
            href={`${storyAeneidTestnet?.blockExplorers?.default.url}/token/${registerDerivativeData?.data?.collection?.spgNftContract}`}
            className="text-purple-500 hover:underline"
            rel="noreferrer"
            target="_blank"
          >
            View transaction details
          </a>
        </div>
      ) : !getEVMAuth ? (
        <EVMWallets title="Login with EVM" login={login} className="w-[97%]" />
      ) : (
        <div className="flex flex-col gap-2">
          <div className="mt-4">
            <p className="text-end mt-4">
              <span>Topup account:</span>
              {isWalletLoading || isWalletRefetching ? (
                <span className="text-blue-500"> Loading address... </span>
              ) : (
                <span
                  className="text-blue-500 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(walletData?.publicAddress);
                    toast.success("Copied topup account address");
                  }}
                >
                  {" "}
                  {addressCrop(walletData?.publicAddress)}
                </span>
              )}
            </p>
            <p className="text-end">
              <span>Topup balance:</span>
              {isWalletLoading || isWalletRefetching ? (
                <span className="text-blue-500"> Loading balance... </span>
              ) : (
                <span>
                  {" "}
                  {walletData?.balance}{" "}
                  {storyAeneidTestnet?.nativeCurrency?.symbol}{" "}
                </span>
              )}
            </p>
          </div>
          {walletData?.publicAddress && (
            <Topup
              topUpAccount={walletData?.publicAddress}
              isIP={true}
              balance={walletData?.balance}
              refetchWallet={refetchWallet}
              sponsored={walletData?.sponsored}
            />
          )}
          {/* {actionType !== 'composer' && walletData?.balance > 0 && <WithdrawFunds refetchWallet={refetchWallet} />} */}
          <div className="mt-4">
            <Button
              disabled={isPending || isLoading}
              fullWidth
              loading={isPending || isLoading}
              // color="yellow"
              onClick={handleSubmit}
            >
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </div>

          {isMobile && (
            <div className="mt-4">
              <WatermarkRemover />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Derivative;
