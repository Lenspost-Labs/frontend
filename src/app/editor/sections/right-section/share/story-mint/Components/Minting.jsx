import { useContext } from "react";
import { Context } from "../../../../../../../providers/context";
import { useAppAuth, useReset } from "../../../../../../../hooks/app";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  uploadJSONtoIPFS,
  uploadUserAssetToIPFS,
} from "../../../../../../../services";
import { toast } from "react-toastify";
import useMint721 from "../../../../../../../hooks/mint721/useMint721";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { useEffect } from "react";
import { getFromLocalStorage } from "../../../../../../../utils";
import {
  LOCAL_STORAGE,
  STORY_ODYSSEY_ADDRESS,
} from "../../../../../../../data";
import { storyOdysseyTestnet } from "../../../../../../../data/network/storyOdyssey";
import storyABI from "../../../../../../../data/json/storyABI.json";
import { InputBox, SelectBox } from "../../../../../common";
import { EVMWallets } from "../../../../top-section/auth/wallets";
import { Button, Textarea } from "@material-tailwind/react";
import useReownAuth from "../../../../../../../hooks/reown-auth/useReownAuth";

const getPILTypeString = (type) => {
  switch (type) {
    case 0:
      return "NON_COMMERCIAL_REMIX";
    case 2:
      return "COMMERCIAL_REMIX";
    case 1:
      return "COMMERCIAL_USE";
    default:
      return "";
  }
};

const licenseOptions = [
  {
    label: "Non-Commercial Remix",
    value: getPILTypeString(0),
  },
  {
    label: "Commercial Remix",
    value: getPILTypeString(2),
  },
];

const revenueShareOptions = [
  { label: "0", value: "0" },
  { label: "10", value: "10" },
  { label: "20", value: "20" },
  { label: "30", value: "30" },
  { label: "40", value: "40" },
  { label: "50", value: "50" },
  { label: "Custom", value: "custom" },
];

const Minting = () => {
  const {
    postDescription,
    setMenu,
    canvasBase64Ref,
    setPostDescription,
    contextCanvasIdRef,
    isMobile,
  } = useContext(Context);
  const { resetState } = useReset();
  const { login } = useReownAuth();
  const { isAuthenticated } = useAppAuth();
  const { address, isConnected } = useAccount();

  const [charLimitError, setCharLimitError] = useState("");

  const {
    error: errorSwitchNetwork,
    isError: isErrorSwitchNetwork,
    isLoading: isLoadingSwitchNetwork,
    isSuccess: isSuccessSwitchNetwork,
    switchChain,
  } = useSwitchChain();

  const chainId = useChainId();

  const [collectionName, setCollectionName] = useState("");
  const [collectionSymbol, setCollectionSymbol] = useState("");
  const [revShare, setRevShare] = useState(0);
  const [license, setLicense] = useState("");
  const [customRevShare, setCustomRevShare] = useState("");

  const getEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);

  const mintParams = () => {
    let params = {
      address: STORY_ODYSSEY_ADDRESS,
      chainId: storyOdysseyTestnet.id,
      args: [address, `ipfs://${uploadJSONData?.message}`],
      abi: storyABI,
      functionName: "mint",
    };

    return params;
  };

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
    mutate: uploadJSONtoIPFSMutate,
    data: uploadJSONData,
    isError: isUploadJSONError,
    error: uploadJSONError,
    isSuccess: isUploadJSONSuccess,
    isLoading: isUploadingJSON,
    isPending: isUploadJSONPending,
  } = useMutation({
    mutationKey: "uploadJSONtoIPFS",
    mutationFn: uploadJSONtoIPFS,
  });

  // upload JSON data to IPFS
  useEffect(() => {
    if (uploadData?.message) {
      let jsonData = {
        name: collectionName,
        symbol: collectionSymbol,
        description: postDescription,
        image: `ipfs://${uploadData?.message}`,
        pilType: license,
        pilTerms: {},
      };

      let pilTerms = {};

      if (license === getPILTypeString(2)) {
        pilTerms = {
          mintingFee: 0,
          currency: "0xC0F6E387aC0B324Ec18EAcf22EE7271207dCE3d5",
          commercialRevShare: revShare,
        };
      }

      jsonData = { ...jsonData, pilTerms };
      uploadJSONtoIPFSMutate(jsonData);
    }
  }, [isUploadSuccess]);

  useEffect(() => {
    if (isUploadJSONError) {
      console.log(uploadJSONError);
      toast.error(uploadJSONError?.message);
    }
  }, [isUploadJSONError, uploadJSONError]);

  useEffect(() => {
    if (isUploadError) {
      console.log(uploadError);
      toast.error(uploadError?.message);
    }
  }, [isUploadError, uploadError]);

  const {
    tx: { isTxConfirming, isTxSuccess, isTxError, txError, txData },
    write: { isWriteError, writeError, isWriting, mint721 },
    simulation: { refetchSimulation },
  } = useMint721(mintParams());

  useEffect(() => {
    if (isTxSuccess) {
      console.log("isTxSuccess", txData);
      //resetState()
      toast.success("NFT minted successfully!");
    }
  }, [isTxSuccess, txData]);

  useEffect(() => {
    if (isWriteError || isTxError) {
      const error = writeError || txError;
      const errorMessage = error?.message?.split("\n")[0];
      if (errorMessage?.includes("connector not connected")) {
        toast.error("Please connect your wallet");
      } else {
        toast.error(errorMessage || "An error occurred");
      }
    }
  }, [isWriteError, writeError, isTxError, txError]);

  useEffect(() => {
    if (isUploadJSONSuccess) {
      mint721();
    }
  }, [isUploadJSONSuccess]);

  // Add a new state to track if custom is selected
  const [isCustomSelected, setIsCustomSelected] = useState(false);

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
    } else if (name === "symbol") {
      setCollectionSymbol(value);
      if (isMobile) {
        setCollectionSymbol("Default Symbol");
      }
    } else if (name === "revenueShare") {
      if (value === "custom") {
        setRevShare("");
        setIsCustomSelected(true);
      } else {
        setRevShare(value);
        setIsCustomSelected(false);
      }
    } else if (name === "customRevShare") {
      if (value === "" || /^\d+$/.test(value)) {
        const numValue = parseInt(value);
        if (value === "" || (numValue >= 0 && numValue <= 100)) {
          setCustomRevShare(value);
          setRevShare(value === "" ? "" : numValue);
        }
      }
    } else if (name === "license") {
      setLicense(value);
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

  // checking unsupported chain for individual networks
  const isUnsupportedChain = () => {
    if (chainId !== storyOdysseyTestnet.id && !isSuccessSwitchNetwork)
      return true;
  };

  // mint on Zora
  const handleSubmit = () => {
    console.log("handleSubmit");
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

    // check if collection name is provided
    if (!collectionName) {
      toast.error("Please provide a collection name");
      return;
    }

    // check if collection symbol is provided
    if (!collectionSymbol) {
      toast.error("Please provide a collection symbol");
      return;
    }

    // check if description is provided
    if (!postDescription) {
      toast.error("Please provide a description");
      return;
    }

    console.log("handleSubmit", "mutate");

    // upload to IPFS
    mutate(canvasBase64Ref.current[0]);
  };

  const isPending = isUploadPending || isUploadJSONPending;

  const isLoading =
    isUploading || isUploadingJSON || isWriting || isTxConfirming;

  return (
    <div>
      <div className=" mt-1 pt-2 pb-4">
        <div className="flex justify-between">
          <h2 className="text-lg"> NFT Details </h2>
        </div>
      </div>

      <div className={` `}>
        <div className="flex flex-col w-full py-2">
          <InputBox
            label="Name"
            name="title"
            disabled={isLoading}
            onChange={(e) => handleInputChange(e)}
            onFocus={(e) => handleInputChange(e)}
            value={collectionName}
          />

          <div className="mt-4">
            <InputBox
              label="Symbol"
              name="symbol"
              disabled={isLoading}
              onChange={(e) => handleInputChange(e)}
              onFocus={(e) => handleInputChange(e)}
              value={collectionSymbol}
            />
          </div>
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
          <div className="mt-4">
            <SelectBox
              options={licenseOptions.map((option) => ({
                ...option,
                value: option.value.toString(),
              }))}
              onChange={(e) => handleInputChange(e)}
              name="license"
              label="License"
            />
          </div>

          {license === getPILTypeString(2) && (
            <div className="mt-4">
              <SelectBox
                options={revenueShareOptions}
                onChange={(e) => handleInputChange(e)}
                name="revenueShare"
                label="Revenue Share"
                value={isCustomSelected ? "custom" : revShare.toString()}
              />
              {isCustomSelected && (
                <div className="mt-2">
                  <InputBox
                    label="Custom Revenue Share (%)"
                    name="customRevShare"
                    type="text"
                    min="0"
                    max="100"
                    disabled={isLoading}
                    onChange={(e) => handleInputChange(e)}
                    value={customRevShare}
                    placeholder="Enter value between 0-100"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      {isTxSuccess && txData ? (
        <div className="flex flex-col gap-2 mt-4 justify-center items-center">
          <p className="text-green-500 font-bold">NFT minted successfully!</p>
          <p className="font-bold text-lg mt-3">
            Share NFT on Social Platforms
          </p>
          <div className="flex items-center gap-5">
            <Button className="font-medium" onClick={() => setMenu("xshare")}>
              Share on X
            </Button>
            <Button
              className="font-medium"
              onClick={() => setMenu("farcasterShare")}
            >
              Share on Farcaster
            </Button>
          </div>
          <a
            href={`${storyOdysseyTestnet?.blockExplorers?.default.url}/token/${STORY_ODYSSEY_ADDRESS}`}
            className="text-purple-500 hover:underline"
            rel="noreferrer"
            target="_blank"
          >
            View transaction details
          </a>
        </div>
      ) : !getEVMAuth ? (
        <EVMWallets title="Login with EVM" login={login} className="w-[97%]" />
      ) : isUnsupportedChain() ? (
        <div className="outline-none mt-4">
          <Button
            className="w-full outline-none flex justify-center items-center gap-2"
            disabled={isLoadingSwitchNetwork}
            loading={isLoadingSwitchNetwork}
            onClick={() => switchChain({ chainId: storyOdysseyTestnet.id })}
            color="red"
          >
            {isLoadingSwitchNetwork ? "Switching" : "Switch"} to{" "}
            {storyOdysseyTestnet.name} Network{" "}
            {isLoadingSwitchNetwork && <Spinner />}
          </Button>
        </div>
      ) : (
        <div className="mt-4">
          <Button
            disabled={isPending || isUnsupportedChain() || isLoading}
            fullWidth
            loading={isLoading}
            // color="yellow"
            onClick={handleSubmit}
          >
            {" "}
            {isLoading ? "Minting..." : "Mint NFT"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Minting;
