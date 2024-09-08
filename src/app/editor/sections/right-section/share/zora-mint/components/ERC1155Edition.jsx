import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../../../../../../../providers/context";
import { InputBox, InputErrorMsg, NumberInputBox } from "../../../../../common";
import { Typography } from "@material-tailwind/react";
import { Button } from "@material-tailwind/react";
import BsPlus from "@meronex/icons/bs/BsPlus";
import { useCreateSplit } from "../../../../../../../hooks/0xsplit";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWriteContract,
  useWalletClient,
  useSwitchChain,
} from "wagmi";
import { createCreatorClient } from "@zoralabs/protocol-sdk";
import {
  ENVIRONMENT,
  getENSDomain,
  uploadJSONtoIPFS,
  uploadUserAssetToIPFS,
} from "../../../../../../../services";
import { APP_ETH_ADDRESS } from "../../../../../../../data";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useAppAuth, useStoreZoraLink } from "../../../../../../../hooks/app";
import { chainLogo } from "../../../../../../../utils";
import ZoraDialog from "./ZoraDialog";
import { base, baseSepolia } from "viem/chains";
import { usePrivy } from "@privy-io/react-auth";
import {
  handleChange,
  handleRecipientChange,
  isRecipientAddDuplicate,
  restrictRecipientInput,
  restrictRemoveRecipientInputBox,
  isPercentage100,
  addArrlistInputBox,
} from "../utils";

const ERC1155Edition = () => {
  const {
    zoraErc1155Enabled,
    setZoraErc1155Enabled,
    zoraErc1155StatesError,
    setZoraErc1155StatesError,
    contextCanvasIdRef,
    postDescription,
    parentRecipientListRef,
    canvasBase64Ref,
    actionType,
    posthog,
    farcasterStates, // don't remove this
    lensAuthState, // don't remove this
  } = useContext(Context);
  const { chain } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const walletClient = useWalletClient();
  const { login, authenticated } = usePrivy();
  const { storeZoraLink } = useStoreZoraLink();
  const { address } = useAccount();
  const [slug, setSlug] = useState("");
  const { isAuthenticated } = useAppAuth();

  const [recipientsEns, setRecipientsEns] = useState([]);
  const [totalPercent, setTotalPercent] = useState(0);
  const [contractAddress, setContractAddress] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isContractPending, setIsContractPending] = useState(false);
  const [deploymentError, setDeploymentError] = useState(false);

  const creatorClient = createCreatorClient({ chainId, publicClient });
  const contractSymbol = zoraErc1155Enabled?.contractName
    ?.split(" ")[0]
    .toUpperCase();

  const { isLoading: isLoadingSwitchNetwork, switchChain } = useSwitchChain();
  const supportedChainId =
    ENVIRONMENT === "production" ? base.id : baseSepolia.id;

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

  const {
    createSplit,
    data: createSplitData,
    error: createSplitError,
    isError: isCreateSplitError,
    isLoading: isCreateSplitLoading,
    isSuccess: isCreateSplitSuccess,
  } = useCreateSplit();

  const create1155 = async () => {
    try {
      const { parameters, contractAddress } = await creatorClient.create1155({
        // the contract will be created at a deterministic address
        contract: {
          // contract name
          name: zoraErc1155Enabled?.contractName,
          // contract metadata uri
          uri: `ipfs://${uploadJSONData?.message}`,
        },
        token: {
          tokenMetadataURI: `ipfs://${uploadJSONData?.message}`,
          createReferral: APP_ETH_ADDRESS,
          payoutRecipient: createSplitData?.splitAddress,
          royaltyBPS: "500",
          salesConfig: {
            // manually specifying the erc20 name and symbol
            erc20Name: zoraErc1155Enabled?.contractName,
            erc20Symbol: contractSymbol,
          },
        },
        // account to execute the transaction (the creator)
        account: address,
      });

      const { request } = await publicClient.simulateContract(parameters);

      // execute the transaction
      setIsDeploying(true);
      const hash = await walletClient.data.writeContract(request);
      setIsDeploying(false);

      // wait for the response
      setIsContractPending(true);
      const hxTxRes = await publicClient.waitForTransactionReceipt({ hash });
      setIsContractPending(false);

      setContractAddress(contractAddress);

      let paramsData = {
        canvasId: contextCanvasIdRef.current,
        mintLink: contractAddress,
        chain: chain?.name,
        contractType: "ZORA1155",
        chainId: chain?.id,
        hash: contractAddress,
      };

      try {
        const slug = await storeZoraLink(paramsData); // Use the custom hook
        setSlug(slug);
      } catch (error) {
        console.log("Slug error", error);
      }

      const embeds = `https://zora.co/collect/base:${contractAddress}/1`;

      window.parent.postMessage(
        {
          type: "createCast",
          data: {
            cast: {
              text: postDescription,
              embeds: [embeds],
            },
          },
        },
        "*"
      );

      posthog.capture("Canvas Posted To Farcaster", {
        canvas_id: contextCanvasIdRef.current,
        access_platform: "composer",
        mintable: "yes",
        nftType: "ERC1155",
        chainId: chain?.id,
      });

      console.log("shared on FC", embeds);
    } catch (error) {
      console.error("error deploying contract \n", error);
      setIsDeploying(false);
      setIsContractPending(false);
    }
  };
  // split contract settings
  const handleCreateSplitSettings = () => {
    const args = {
      recipients: zoraErc1155Enabled.royaltySplitRecipients,
      distributorFeePercent: 0.0,
      controller: APP_ETH_ADDRESS,
      // controller is the owner of the split contract that will make it mutable contract
    };
    return args;
  };

  // mint on Zora
  const handleSubmit = () => {
    // check if canvasId is provided
    if (contextCanvasIdRef.current === null) {
      toast.error("Please select a design");
      return;
    }

    // check if description is provided
    if (!postDescription) {
      toast.error("Please provide a description");
      return;
    }

    // check if collection name is provided
    if (!zoraErc1155Enabled.contractName) {
      setZoraErc1155StatesError({
        ...zoraErc1155StatesError,
        isContractNameError: true,
        contractNameErrorMessage: "Collection Name is required",
      });
      return;
    }

    // check if price is provided
    if (zoraErc1155Enabled.isChargeForMint) {
      if (!zoraErc1155Enabled.chargeForMintPrice) {
        setZoraErc1155StatesError({
          ...zoraErc1155StatesError,
          isChargeForMintError: true,
          chargeForMintErrorMessage: "Price is required",
        });
        return;
      } else if (zoraErc1155StatesError.isChargeForMintError) return;
    }

    // check if mint limit is provided
    if (zoraErc1155Enabled.isMintLimitPerAddress) {
      if (zoraErc1155StatesError.isMintLimitPerAddressError) return;
    }

    // check if royalty percent is provided
    if (zoraErc1155Enabled.isRoyaltyPercent) {
      if (zoraErc1155StatesError.isRoyaltyPercentError) {
        return;
      } else if (!zoraErc1155Enabled.royaltyPercent) {
        setZoraErc1155StatesError({
          ...zoraErc1155StatesError,
          isRoyaltyPercentError: true,
          royaltyPercentErrorMessage: "Royalty percent is required",
        });
        return;
      }
    }

    // check if recipient address is same
    if (isRecipientAddDuplicate(zoraErc1155Enabled)) {
      setZoraErc1155StatesError({
        ...zoraErc1155StatesError,
        isRoyaltySplitError: true,
        royaltySplitErrorMessage: "Recipient address is duplicate",
      });
      return;
    } else if (!isPercentage100(zoraErc1155Enabled, setTotalPercent)) {
      setZoraErc1155StatesError({
        ...zoraErc1155StatesError,
        isRoyaltySplitError: true,
        royaltySplitErrorMessage: "Recipient percentage should be 100%",
      });
      return;
    } else {
      setZoraErc1155StatesError({
        ...zoraErc1155StatesError,
        isRoyaltySplitError: false,
        royaltySplitErrorMessage: "",
      });
    }

    // upload to IPFS
    mutate(canvasBase64Ref.current[0]);
  };

  // split even percentage
  const splitEvenPercentage = () => {
    const result = zoraErc1155Enabled.royaltySplitRecipients?.map((item) => {
      return {
        address: item.address,
        percentAllocation: Math.floor(
          (100 / zoraErc1155Enabled.royaltySplitRecipients.length).toFixed(2)
        ),
      };
    });

    setZoraErc1155Enabled((prevEnabled) => ({
      ...prevEnabled,
      royaltySplitRecipients: result,
    }));
  };

  // funtion to remove input box for multi addresses
  const removeArrlistInputBox = (index, key, isErrKey, errKeyMsg) => {
    setZoraErc1155Enabled({
      ...zoraErc1155Enabled,
      [key]: zoraErc1155Enabled[key].filter((_, i) => i !== index),
    });

    if (isErrKey) {
      setZoraErc1155StatesError({
        ...zoraErc1155StatesError,
        [isErrKey]: false,
        [errKeyMsg]: "",
      });
    }
  };

  // add recipient to the split list
  useEffect(() => {
    if (isAuthenticated) {
      const updatedRecipients = parentRecipientListRef.current.map((item) => ({
        address: item,
        percentAllocation: 1.0,
      }));

      setZoraErc1155Enabled((prevEnabled) => ({
        ...prevEnabled,
        royaltySplitRecipients: [
          {
            address: APP_ETH_ADDRESS,
            percentAllocation: 10.0,
          },
          ...updatedRecipients,
        ],
      }));

      const recipients = updatedRecipients.map((item) => {
        return item.address;
      });

      const addresses = [APP_ETH_ADDRESS, ...recipients];

      // getting ENS domain
      (async () => {
        const domains = await getENSDomain(addresses);
        setRecipientsEns(domains);
      })();
    }
  }, [isAuthenticated]);

  // upload JSON data to IPFS
  useEffect(() => {
    if (uploadData?.message) {
      const jsonData = {
        name: zoraErc1155Enabled?.contractName,
        description: postDescription,
        image: uploadData?.message,
        animation_url: "",
        content: {},
        attributes: [],
      };
      uploadJSONtoIPFSMutate(jsonData);
    }
  }, [isUploadSuccess]);

  // create split contract
  useEffect(() => {
    if (uploadJSONData?.message) {
      createSplit(handleCreateSplitSettings());
    }
  }, [isUploadJSONSuccess]);

  // create 1155 contract
  useEffect(() => {
    if (createSplitData?.splitAddress) {
      create1155();
    }
  }, [isCreateSplitSuccess]);

  // error handling for create split
  useEffect(() => {
    if (isCreateSplitError) {
      console.error("create split error", createSplitError);
      toast.error(createSplitError.message.split("\n")[0]);
    }
  }, [isCreateSplitError]);

  return (
    <>
      <ZoraDialog
        title="ERC1155 Edition"
        icon={chainLogo(chainId)}
        isError={isUploadError || isCreateSplitError || deploymentError}
        isLoading={isDeploying}
        isCreatingSplit={isCreateSplitLoading}
        isUploadingToIPFS={isUploadPending || isUploadJSONPending}
        isPending={isContractPending}
        data={contractAddress}
        isSuccess={contractAddress}
        slug={slug}
      />

      {/* Switch Number 1 Start */}
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Collection Details </h2>
        </div>
        <div className="w-4/5 opacity-75"> Set a Name for the collection </div>
      </div>
      <div className={` ml-4 mr-4`}>
        <div className="flex flex-col w-full py-2">
          <InputBox
            label="Collection Name"
            name="contractName"
            onChange={(e) =>
              handleChange(e, setZoraErc1155Enabled, setZoraErc1155StatesError)
            }
            onFocus={(e) =>
              handleChange(e, setZoraErc1155Enabled, setZoraErc1155StatesError)
            }
            value={zoraErc1155Enabled.contractName}
          />
          {zoraErc1155StatesError.isContractNameError && (
            <InputErrorMsg
              message={zoraErc1155StatesError.isContractNameErrorMessage}
            />
          )}
        </div>
      </div>

      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Split Pecipients </h2>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Split revenue between multiple recipients{" "}
        </div>
      </div>

      <div className={`${!zoraErc1155Enabled.isRoyaltySplits && "hidden"}`}>
        <div className="mx-4">
          {zoraErc1155Enabled.royaltySplitRecipients?.map(
            (recipient, index) => {
              return (
                <>
                  <div
                    key={index}
                    className="flex justify-between gap-2 items-center w-full py-2"
                  >
                    {/* <div className="flex justify-between items-center w-1/3"> */}
                    <InputBox
                      className="w-full"
                      label="Wallet Address"
                      value={recipientsEns[index] || recipient.address}
                      onChange={(e) =>
                        restrictRecipientInput(
                          index,
                          e.target?.value,
                          recipient?.address,
                          "address",
                          zoraErc1155Enabled,
                          setZoraErc1155Enabled,
                          zoraErc1155Enabled,
                          setZoraErc1155StatesError,
                          parentRecipientListRef
                        )
                      }
                    />
                    {/* </div> */}
                    <div className="flex justify-between items-center w-1/3">
                      <NumberInputBox
                        className="w-4"
                        min={0}
                        max={100}
                        step={0.01}
                        label="%"
                        value={recipient.percentAllocation?.toString()}
                        onChange={(e) => {
                          handleRecipientChange(
                            index,
                            "percentAllocation",
                            Number(parseFloat(e.target.value).toFixed(2)),
                            zoraErc1155Enabled,
                            setZoraErc1155Enabled,
                            zoraErc1155StatesError,
                            setZoraErc1155StatesError
                          );
                        }}
                      />
                      {!restrictRemoveRecipientInputBox(
                        index,
                        recipient.address,
                        parentRecipientListRef
                      ) && (
                        <XCircleIcon
                          className="h-6 w-6 cursor-pointer"
                          color="red"
                          onClick={() =>
                            removeArrlistInputBox(
                              index,
                              "royaltySplitRecipients",
                              "isRoyaltySplitError",
                              "royaltySplitErrorMessage"
                            )
                          }
                        />
                      )}
                    </div>
                  </div>
                </>
              );
            }
          )}

          {zoraErc1155StatesError.isRoyaltySplitError && (
            <>
              <InputErrorMsg
                message={zoraErc1155StatesError.isRoyaltySplitErrorMessage}
              />
              <Typography variant="h6" color="blue-gray">
                {totalPercent} %
              </Typography>
            </>
          )}

          <div className="flex justify-between">
            <Button
              // color="yellow"
              size="sm"
              variant="filled"
              className="flex items-center gap-3 mt-2 ml-0 outline-none bg-[#e1f16b] text-black"
              onClick={() =>
                addArrlistInputBox(
                  "royaltySplitRecipients",
                  setZoraErc1155Enabled
                )
              }
            >
              <BsPlus />
              Add Recipient
            </Button>
            <Button
              // color="yellow"
              size="sm"
              variant="filled"
              className="flex items-center gap-3 mt-2 ml-0 outline-none bg-[#e1f16b] text-black"
              onClick={splitEvenPercentage}
            >
              Split Even
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-2 my-4">
        {actionType === "composer" && !authenticated ? (
          <Button fullWidth onClick={login}>
            {" "}
            Connect wallet{" "}
          </Button>
        ) : chainId !== base?.id ? (
          <Button
            fullWidth
            disabled={isLoadingSwitchNetwork}
            onClick={() => switchChain({ chainId: supportedChainId })}
            color="red"
          >
            {" "}
            Switch to Base network{" "}
          </Button>
        ) : (
          <Button
            className="bg-[#e1f16b] text-black"
            fullWidth
            onClick={handleSubmit}
          >
            {" "}
            Create{" "}
          </Button>
        )}
      </div>
    </>
  );
};

export default ERC1155Edition;
