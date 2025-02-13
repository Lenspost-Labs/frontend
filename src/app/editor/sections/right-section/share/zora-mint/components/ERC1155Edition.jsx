import { Switch } from "@headlessui/react";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { Context } from "../../../../../../../providers/context";
import { InputBox, InputErrorMsg, NumberInputBox } from "../../../../../common";
import { Option, Select, Textarea, Typography } from "@material-tailwind/react";
import { DateTimePicker } from "@atlaskit/datetime-picker";
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
import { useAppAuth, useLocalStorage } from "../../../../../../../hooks/app";
import { chainLogo, errorMessage } from "../../../../../../../utils";
import { mintToXchain } from "../../../../../../../services/apis/BE-apis";
import ZoraDialog from "./ZoraDialog";
import { base, baseSepolia } from "viem/chains";
import useReownAuth from "../../../../../../../hooks/reown-auth/useReownAuth";

const ERC1155Edition = () => {
  const {
    postName,
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
    isMobile,
    setPostDescription,
    setPostName,
  } = useContext(Context);
  const { chain } = useAccount();
  const chainId = useChainId();
  const publicClient = usePublicClient();
  const walletClient = useWalletClient();
  const { openReown } = useReownAuth();

  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const { isAuthenticated } = useAppAuth();
  const [recipientsEns, setRecipientsEns] = useState([]);
  const [totalPercent, setTotalPercent] = useState(0);
  const [contractAddress, setContractAddress] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [isContractPending, setIsContractPending] = useState(false);
  const [deploymentError, setDeploymentError] = useState(false);
  const [slug, setSlug] = useState("");

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

  // store zora link in DB Mutation
  const { mutateAsync: storeZoraLinkMutation } = useMutation({
    mutationKey: "storeZoraLink",
    mutationFn: mintToXchain,
  });

  const storeZoraLink = (paramsData) => {
    storeZoraLinkMutation(paramsData)
      .then((res) => {
        console.log("StoreZoraLink", res?.slug);
        setSlug(res?.slug);
      })
      .catch((error) => {
        console.log("StoreZoraLinkErr", errorMessage(error));
      });
  };

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
      storeZoraLink(paramsData);

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

  // handle for input fields
  const handleChange = (e, index, key) => {
    const { name, value } = e.target;

    // if name and description is provided
    if (name === "description") {
      if (!value) {
        setZoraErc1155StatesError({
          ...zoraErc1155StatesError,
          isDescriptionError: true,
          descriptionErrorMessage: "Please provide a description",
        });
      }
      setZoraErc1155StatesError({
        ...zoraErc1155StatesError,
        isDescriptionError: false,
        descriptionErrorMessage: "",
      });

      setPostDescription(value);
    }

    if (name === "title") {
      if (!value) {
        setZoraErc1155StatesError({
          ...zoraErc1155StatesError,
          isNameError: true,
          nameErrorMessage: "Please provide a title",
        });
      }
      setZoraErc1155StatesError({
        ...zoraErc1155StatesError,
        isNameError: false,
        nameErrorMessage: "",
      });
      setPostName(value);
    }

    // check if collection name and symbol are provided
    if (name === "contractName") {
      if (!value) {
        setZoraErc1155StatesError({
          ...zoraErc1155StatesError,
          isContractNameError: true,
          contractNameErrorMessage: "Collection Name is required",
        });
      } else {
        setZoraErc1155StatesError({
          ...zoraErc1155StatesError,
          isContractNameError: false,
          contractNameErrorMessage: "",
        });
      }
    }

    // check if price is provided
    // if (name === "chargeForMintPrice") {
    //   if (!value) {
    //     setZoraErc1155StatesError({
    //       ...zoraErc1155StatesError,
    //       isChargeForMintError: true,
    //       chargeForMintErrorMessage: "Price is required",
    //     });
    //   } else if (value < 0.001) {
    //     setZoraErc1155StatesError({
    //       ...zoraErc1155StatesError,
    //       isChargeForMintError: true,
    //       chargeForMintErrorMessage: "Price must be greater than 0.001",
    //     });
    //   } else {
    //     setZoraErc1155StatesError({
    //       ...zoraErc1155StatesError,
    //       isChargeForMintError: false,
    //       chargeForMintErrorMessage: "",
    //     });
    //   }
    // }

    // check if mint limit is provided
    // if (name === "mintLimitPerAddress") {
    //   if (!value) {
    //     setZoraErc1155StatesError({
    //       ...zoraErc1155StatesError,
    //       isMintLimitPerAddressError: true,
    //       limitedEditionErrorMessage: "Mint limit is required",
    //     });
    //   } else if (value < 1) {
    //     setZoraErc1155StatesError({
    //       ...zoraErc1155StatesError,
    //       isMintLimitPerAddressError: true,
    //       limitedEditionErrorMessage: "Mint limit must be greater than 0",
    //     });
    //   } else {
    //     setZoraErc1155StatesError({
    //       ...zoraErc1155StatesError,
    //       isMintLimitPerAddressError: false,
    //       limitedEditionErrorMessage: "",
    //     });
    //   }
    // }

    // check if royalty percent is provided
    if (name === "royaltyPercent") {
      if (!value) {
        setZoraErc1155StatesError({
          ...zoraErc1155StatesError,
          isRoyaltyPercentError: true,
          royaltyPercentErrorMessage: "Royalty percent is required",
        });
      } else if (value < 1 || value > 100) {
        setZoraErc1155StatesError({
          ...zoraErc1155StatesError,
          isRoyaltyPercentError: true,
          royaltyPercentErrorMessage: "Royalty must be between 1% to 100%",
        });
      } else {
        setZoraErc1155StatesError({
          ...zoraErc1155StatesError,
          isRoyaltyPercentError: false,
          royaltyPercentErrorMessage: "",
        });
      }
    }

    // check if max supply is provided
    // if (name === "maxSupply") {
    //   if (!value) {
    //     setZoraErc1155StatesError({
    //       ...zoraErc1155StatesError,
    //       isMaxSupplyError: true,
    //       maxSupplyErrorMessage: "Max supply is required",
    //     });
    //   } else if (value < 1) {
    //     setZoraErc1155StatesError({
    //       ...zoraErc1155StatesError,
    //       isMaxSupplyError: true,
    //       maxSupplyErrorMessage: "Max supply must be greater than 0",
    //     });
    //   } else {
    //     setZoraErc1155StatesError({
    //       ...zoraErc1155StatesError,
    //       isMaxSupplyError: false,
    //       maxSupplyErrorMessage: "",
    //     });
    //   }
    // }

    // check if allowlist is provided
    // if (name === "allowlistAddresses") {
    //   if (!value) {
    //     setZoraErc1155StatesError({
    //       ...zoraErc1155StatesError,
    //       isAllowlistError: true,
    //       allowlistErrorMessage: "Allowlist address is required",
    //     });
    //   } else {
    //     setZoraErc1155StatesError({
    //       ...zoraErc1155StatesError,
    //       isAllowlistError: false,
    //       allowlistErrorMessage: "",
    //     });
    //   }
    // }

    // add data
    if (name === "allowlistAddresses") {
      setZoraErc1155Enabled((prevEnabled) => ({
        ...prevEnabled,
        [name]: prevEnabled[name].map((item, i) =>
          i === index ? value : item
        ),
      }));
    } else {
      setZoraErc1155Enabled((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // restrict the input box if the recipient is in the parent list
  const restrictRecipientInput = (e, index, recipient) => {
    const isRecipient = parentRecipientListRef.current.includes(recipient);
    const isUserAddress = recipient === address;
    if (index === 0 || isRecipient) {
      if (isUserAddress) {
        handleRecipientChange(index, "address", e.target.value);
      }
    } else {
      handleRecipientChange(index, "address", e.target.value);
    }
  };

  // restrict the delete button if recipient is in the parent list
  const restrictRemoveRecipientInputBox = (index, recipient) => {
    const isRecipient = parentRecipientListRef.current.includes(recipient);
    if (index === 0 || isRecipient) {
      return true;
    }
  };

  // funtion adding data for split revenues recipients
  const handleRecipientChange = (index, key, value) => {
    // check index 0 price should min 10
    if (key === "percentAllocation" && index === 0) {
      if (value < 10 || value > 100 || isNaN(value)) {
        setZoraErc1155StatesError({
          ...r,
          isRoyaltySplitError: true,
          royaltySplitErrorMessage:
            "Platform fee should be between 10% to 100%",
        });
      } else {
        setZoraErc1155StatesError({
          ...zoraErc1155StatesError,
          isRoyaltySplitError: false,
          royaltySplitErrorMessage: "",
        });
      }
    } else if (key === "percentAllocation" && index !== 0) {
      // any index price should be greater min 1 and max 100
      if (value < 1 || value > 100 || isNaN(value)) {
        setZoraErc1155StatesError({
          zoraErc1155StatesError,
          isRoyaltySplitError: true,
          royaltySplitErrorMessage: "Split should be between 1% to 100%",
        });
      } else {
        setZoraErc1155StatesError({
          ...zoraErc1155StatesError,
          isRoyaltySplitError: false,
          royaltySplitErrorMessage: "",
        });
      }
    }
    // check if recipient address is not provided
    if (key === "address") {
      if (!value) {
        setZoraErc1155StatesError({
          ...zoraErc1155StatesError,
          isRoyaltySplitError: true,
          royaltySplitErrorMessage: "Recipient address is required",
        });
      } else {
        setZoraErc1155StatesError({
          ...zoraErc1155StatesError,
          isRoyaltySplitError: false,
          royaltySplitErrorMessage: "",
        });
      }
    }

    const updatedRecipients = [...zoraErc1155Enabled.royaltySplitRecipients];
    updatedRecipients[index][key] = value;
    setZoraErc1155Enabled((prevEnabled) => ({
      ...prevEnabled,
      royaltySplitRecipients: updatedRecipients,
    }));
  };

  // check if recipient address is same
  const isRecipientAddDuplicate = () => {
    const result = zoraErc1155Enabled.royaltySplitRecipients?.filter(
      (item, index) => {
        return (
          zoraErc1155Enabled.royaltySplitRecipients?.findIndex(
            (item2) =>
              item2.address.toLowerCase() === item.address.toLowerCase()
          ) !== index
        );
      }
    );

    if (result?.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  // check if recipient percentage is more than 100
  const isPercentage100 = () => {
    const result = zoraErc1155Enabled.royaltySplitRecipients.reduce(
      (acc, item) => {
        return acc + item.percentAllocation;
      },
      0
    );

    console.log({ result });

    setTotalPercent(result);

    if (result === 100) {
      return true;
    } else {
      return false;
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

  // mint settings
  // const handleMintSettings = () => {
  //   const createReferral = APP_ETH_ADDRESS;
  //   const defaultAdmin = address;

  //   let contractName = "My Lenspost Collection";
  //   let symbol = "MLC";
  //   let description = "This is my Lenspost Collection";
  //   let allowList = [];
  //   let editionSize = "0xfffffffffff"; // default open edition
  //   let royaltyBps = "0"; // 1% = 100 bps
  //   let animationUri = "0x0";
  //   let imageUri = "0x0";
  //   let fundsRecipient = address;
  //   // max value for maxSalePurchasePerAddress, results in no mint limit
  //   let maxSalePurchasePerAddress = "4294967295";
  //   let publicSalePrice = "0";
  //   let presaleStart = "0";
  //   let presaleEnd = "0";
  //   let publicSaleStart = "0";
  //   // max value for end date, results in no end date for mint
  //   let publicSaleEnd = "18446744073709551615";

  //   if (zoraErc1155Enabled.contractName !== "") {
  //     contractName = zoraErc1155Enabled.contractName;
  //   }

  //   if (zoraErc1155Enabled.contractSymbol !== "") {
  //     symbol = zoraErc1155Enabled.contractSymbol;
  //   }

  //   if (postDescription !== "") {
  //     description = postDescription;
  //   }

  //   if (uploadData?.message) {
  //     imageUri = `ipfs://${uploadData?.message}`;
  //   }

  //   if (createSplitData?.splitAddress) {
  //     fundsRecipient = createSplitData?.splitAddress;
  //   }

  //   if (zoraErc1155Enabled.isChargeForMint) {
  //     publicSalePrice = (
  //       Number(zoraErc1155Enabled.chargeForMintPrice) * 1e18
  //     ).toString();
  //   }

  //   if (zoraErc1155Enabled.isMintLimitPerAddress) {
  //     maxSalePurchasePerAddress = zoraErc1155Enabled.mintLimitPerAddress;
  //   }

  //   if (zoraErc1155Enabled.isRoyaltyPercent) {
  //     royaltyBps = (Number(zoraErc1155Enabled.royaltyPercent) * 100).toString();
  //   }

  //   if (zoraErc1155Enabled.isMaxSupply) {
  //     editionSize = zoraErc1155Enabled.maxSupply;
  //   }

  //   if (zoraErc1155Enabled.isAllowlist) {
  //     allowList = zoraErc1155Enabled.allowlistAddresses;
  //   }

  //   if (zoraErc1155Enabled.isPreSaleSchedule) {
  //     presaleStart = formatDateTimeUnix(
  //       zoraErc1155Enabled.preSaleStartTimeStamp.date,
  //       zoraErc1155Enabled.preSaleStartTimeStamp.time
  //     );
  //     presaleEnd = formatDateTimeUnix(
  //       zoraErc1155Enabled.preSaleEndTimeStamp.date,
  //       zoraErc1155Enabled.preSaleEndTimeStamp.time
  //     );
  //   }

  //   if (zoraErc1155Enabled.isPublicSaleSchedule) {
  //     publicSaleStart = formatDateTimeUnix(
  //       zoraErc1155Enabled.publicSaleStartTimeStamp.date,
  //       zoraErc1155Enabled.publicSaleStartTimeStamp.time
  //     );
  //     publicSaleEnd = formatDateTimeUnix(
  //       zoraErc1155Enabled.publicSaleEndTimeStamp.date,
  //       zoraErc1155Enabled.publicSaleEndTimeStamp.time
  //     );
  //   }

  //   const arr = [
  //     contractName,
  //     symbol,
  //     editionSize,
  //     royaltyBps,
  //     fundsRecipient,
  //     defaultAdmin,
  //     {
  //       publicSalePrice,
  //       maxSalePurchasePerAddress,
  //       publicSaleStart,
  //       publicSaleEnd,
  //       presaleStart,
  //       presaleEnd,
  //       presaleMerkleRoot:
  //         "0x0000000000000000000000000000000000000000000000000000000000000000",
  //     },
  //     description,
  //     animationUri,
  //     imageUri,
  //     createReferral,
  //   ];

  //   return { args: arr };
  // };

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

    // check if max supply is provided
    // if (zoraErc1155Enabled.isMaxSupply) {
    //   if (zoraErc1155StatesError.isMaxSupplyError) return;
    // }

    // check if allowlist is provided
    // if (zoraErc1155Enabled.isAllowlist) {
    //   if (zoraErc1155StatesError.isAllowlistError) return;
    // }

    // check if pre sale schedule is provided
    // if (zoraErc1155Enabled.isPreSaleSchedule) {
    //   if (zoraErc1155StatesError.isPreSaleScheduleError) return;
    // }

    // check if public sale schedule is provided
    // if (zoraErc1155Enabled.isPublicSaleSchedule) {
    //   if (zoraErc1155StatesError.isPublicSaleScheduleError) return;
    // }

    // check if split revenue is provided
    // if (zoraErc1155Enabled.isRoyaltySplits) {
    //   if (zoraErc1155StatesError.isRoyaltySplitError) return;
    // }

    // check if mint limit is provided
    // if (zoraErc1155Enabled.isMintLimitPerAddress) {
    //   if (zoraErc1155StatesError.isMintLimitPerAddressError) return;
    // }

    // check if recipient address is same
    if (isRecipientAddDuplicate()) {
      setZoraErc1155StatesError({
        ...zoraErc1155StatesError,
        isRoyaltySplitError: true,
        royaltySplitErrorMessage: "Recipient address is duplicate",
      });
      return;
    } else if (!isPercentage100()) {
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

  // funtion to add new input box for multi addresses
  const addArrlistInputBox = (key) => {
    if (key === "royaltySplitRecipients") {
      setZoraErc1155Enabled({
        ...zoraErc1155Enabled,
        [key]: [
          ...zoraErc1155Enabled[key],
          { address: "", percentAllocation: "" },
        ],
      });
      return;
    }

    setZoraErc1155Enabled({
      ...zoraErc1155Enabled,
      [key]: [...zoraErc1155Enabled[key], ""],
    });
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
      <div className="mb-4 mt-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Collection Details </h2>
        </div>
        <div className="w-4/5 opacity-75"> Set a Name for the collection </div>
      </div>
      <div>
        <div className="flex flex-col w-full py-2">
          <InputBox
            label="Collection Name"
            name="contractName"
            onChange={(e) => handleChange(e)}
            onFocus={(e) => handleChange(e)}
            value={zoraErc1155Enabled.contractName}
          />
          {zoraErc1155StatesError.isContractNameError && (
            <InputErrorMsg
              message={zoraErc1155StatesError.contractNameErrorMessage}
            />
          )}
        </div>
      </div>

      <div className="mb-4 mt-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Split Recipients </h2>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Split revenue between multiple recipients{" "}
        </div>
      </div>

      <div className={`${!zoraErc1155Enabled.isRoyaltySplits && "hidden"}`}>
        <div className="mx-0">
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
                        restrictRecipientInput(e, index, recipient.address)
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
                        value={recipient.percentAllocation}
                        onChange={(e) => {
                          handleRecipientChange(
                            index,
                            "percentAllocation",
                            Number(parseFloat(e.target.value).toFixed(2))
                          );
                        }}
                      />
                      {!restrictRemoveRecipientInputBox(
                        index,
                        recipient.address
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
                message={zoraErc1155StatesError.royaltySplitErrorMessage}
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
              onClick={() => addArrlistInputBox("royaltySplitRecipients")}
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

      {/* Or here we can just add description for Mobile */}
      {isMobile && (
        <>
          <div className="mt-4">
            <div className="flex justify-between">
              <h2 className="text-lg"> Title & Description</h2>
            </div>
            {/* <div className="w-4/5 opacity-75">
                  {" "}
                  Enter title fot the NFT.{" "}
                </div> */}
          </div>
          <div className="flex flex-col gap-2  mt-4">
            <InputBox
              label={"Title"}
              name="title"
              onChange={(e) => handleChange(e)}
              value={postName}
            />
            <Textarea
              label={"Description"}
              name="description"
              onChange={(e) => handleChange(e)}
              value={postDescription}
            />
          </div>
        </>
      )}
      <div className="mx-0 my-4">
        {actionType === "composer" && !isAuthenticated ? (
          <Button fullWidth onClick={() => openReown("AllWallets")}>
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
