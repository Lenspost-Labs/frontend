import React, { useEffect, useMemo, useState } from "react";
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
  totalSplitPercentage,
  addArrlistInputBox,
  handleCreateSplitSettings,
  splitEvenPercentage,
  removeArrlistInputBox,
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
  const [contractAddress, setContractAddress] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isContractPending, setIsContractPending] = useState(false);
  const [deploymentError, setDeploymentError] = useState(false);

  // Memoize the creator client to avoid re-creation on every render
  const creatorClient = useMemo(
    () => createCreatorClient({ chainId, publicClient }),
    [chainId, publicClient]
  );

  // Memoize the contract symbol to avoid recalculating on every render
  const contractSymbol = useMemo(() => {
    return zoraErc1155Enabled?.contractName?.split(" ")[0]?.toUpperCase() || "";
  }, [zoraErc1155Enabled]);

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
      console.error("Error deploying contract:", error);
      toast.error("Error deploying contract. Please try again.");
      setIsDeploying(false);
      setIsContractPending(false);
    }
  };

  // mint on Zora
  const handleSubmit = () => {
    const errors = {
      design: contextCanvasIdRef.current === null,
      description: !postDescription,
      contractName: !zoraErc1155Enabled.contractName,
      chargeForMintPrice:
        zoraErc1155Enabled.isChargeForMint &&
        !zoraErc1155Enabled.chargeForMintPrice,
      royaltyPercent:
        zoraErc1155Enabled.isRoyaltyPercent &&
        !zoraErc1155Enabled.royaltyPercent,
    };

    for (const [key, value] of Object.entries(errors)) {
      if (value) {
        toast.error(`Please provide a valid ${key}`);
        return;
      }
    }

    if (isRecipientAddDuplicate(zoraErc1155Enabled)) {
      setZoraErc1155StatesError({
        ...zoraErc1155StatesError,
        isRoyaltySplitError: true,
        royaltySplitErrorMessage: "Recipient address is duplicate",
      });
      return;
    }

    const totalPercentage = totalSplitPercentage(zoraErc1155Enabled);
    if (totalPercentage !== 100) {
      setZoraErc1155StatesError({
        ...zoraErc1155StatesError,
        isRoyaltySplitError: true,
        royaltySplitErrorMessage: `Total recipient percentage should be 100%, but it's ${totalPercentage}%`,
      });
      return;
    }

    console.log(
      "Uploading to IPFS with canvas data:",
      canvasBase64Ref.current[0]
    );
    mutate(canvasBase64Ref.current[0]);
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

      const addresses = [
        APP_ETH_ADDRESS,
        ...updatedRecipients.map((item) => item.address),
      ];

      // Fetch ENS domains only if addresses are available
      if (addresses.length) {
        (async () => {
          const domains = await getENSDomain(addresses);
          setRecipientsEns(domains);
        })();
      }
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
      createSplit(handleCreateSplitSettings(zoraErc1155Enabled));
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
          <h2 className="text-lg mb-2"> Split Recipients </h2>
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
                          zoraErc1155StatesError,
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
                        onFocus={(e) => {
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
                              "royaltySplitErrorMessage",
                              zoraErc1155Enabled,
                              setZoraErc1155Enabled
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
                {totalSplitPercentage(zoraErc1155Enabled)} %
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
              onClick={() =>
                splitEvenPercentage(zoraErc1155Enabled, setZoraErc1155Enabled)
              }
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
        ) : chainId !== chainId ? (
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
