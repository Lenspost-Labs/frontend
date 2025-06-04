import React, { useContext, useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import {
  InputBox,
  InputErrorMsg,
  Networks,
  NumberInputBox,
} from "../../../../../common";
import {
  Avatar,
  Button,
  Option,
  Select,
  Spinner,
  Textarea,
  Typography,
} from "@material-tailwind/react";
import { DateTimePicker } from "@atlaskit/datetime-picker";
import BsPlus from "@meronex/icons/bs/BsPlus";
import FiXCircle from "@meronex/icons/fi/FiXCircle";
import { Context } from "../../../../../../../providers/context";
import { toast } from "react-toastify";
import {
  useAccount,
  useChainId,
  useWriteContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useConfig,
} from "wagmi";
import { useAppAuth, useLocalStorage } from "../../../../../../../hooks/app";
import {
  APP_ETH_ADDRESS,
  ERROR,
  FRAME_URL,
  LOCAL_STORAGE,
  MINT_URL,
  TOKEN_LIST,
  ham,
  isSponsoredChain,
} from "../../../../../../../data";
import {
  ENVIRONMENT,
  getENSDomain,
  shareOnSocials,
} from "../../../../../../../services";
import { zoraNftCreatorV1Config } from "@zoralabs/zora-721-contracts";
import {
  addressCrop,
  chainLogo,
  errorMessage,
  getFromLocalStorage,
  priceFormatter,
  saveToLocalStorage,
} from "../../../../../../../utils";
import ZoraDialog from "./ZoraDialog";
import { useCreateSplit } from "../../../../../../../hooks/0xsplit";
import { useMutation, useQuery } from "@tanstack/react-query";
import { EVMWallets } from "../../../../top-section/auth/wallets";
import {
  FarcasterAuth,
  FarcasterChannel,
  Topup,
} from "../../farcaster-share/components";
import { LensAuth, LensDispatcher } from "../../lens-share/components";
import {
  deployZoraContract,
  getFarUserDetails,
  getOrCreateWallet,
  mintToXchain,
  postFrame,
} from "../../../../../../../services/apis/BE-apis";
import { zoraURLErc721 } from "../utils/zoraURL";
import { ZoraLogo } from "../../../../../../../assets";

import { wagmiAdapter } from "../../../../../../../providers/EVM/EVMWalletProvider";
import { http } from "viem";
import { degen, polygon } from "viem/chains";

import FiSettings from "@meronex/icons/fi/FiSettings";
import usePrivyAuth from "../../../../../../../hooks/privy-auth/usePrivyAuth";
import AddressInputWithENS from "../../components/AddressInputWithENS";

const LP721Edition = ({ isOpenAction, isFarcaster, selectedChainId }) => {
  const { address } = useAccount();
  const { login } = usePrivyAuth();

  const { isAuthenticated } = useAppAuth();
  const { isFarcasterAuth, lensAuth, dispatcher } = useLocalStorage();
  const chainId = useChainId();
  const { chain } = useAccount();
  const { chains } = useConfig();
  const getEVMAuth = getFromLocalStorage(LOCAL_STORAGE.evmAuth);
  const [recipientsEns, setRecipientsEns] = useState([]);
  const [totalPercent, setTotalPercent] = useState(0);
  // share states
  const [isDeployingZoraContractSuccess, setIsDeployingZoraContractSuccess] =
    useState(false);
  const [isDeployingZoraContract, setIsDeployingZoraContract] = useState(false);
  const [respContractAddress, setRespContractAddress] = useState(null);
  const [isDeployingZoraContractError, setIsDeployingZoraContractError] =
    useState(false);

  // farcaster data states
  const [slug, setSlug] = useState("");

  //symbol state
  const [showSymbol, setShowSymbol] = useState(false);

  const {
    error: errorSwitchNetwork,
    isError: isErrorSwitchNetwork,
    isLoading: isLoadingSwitchNetwork,
    isSuccess: isSuccessSwitchNetwork,
    switchChain,
  } = useSwitchChain();

  const {
    postName,
    zoraErc721Enabled,
    setZoraErc721Enabled,
    zoraErc721StatesError,
    setZoraErc721StatesError,
    contextCanvasIdRef,
    postDescription,
    parentRecipientListRef,
    canvasBase64Ref,
    setFarcasterStates,
    farcasterStates, // don't remove this
    lensAuthState, // don't remove this
    actionType,
  } = useContext(Context);

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
    queryFn: () => getOrCreateWallet(chainId),
    refetchOnWindowFocus: false,
  });

  const { mutateAsync: deployZoraContractMutation } = useMutation({
    mutationKey: "deployZoraContract",
    mutationFn: deployZoraContract,
  });

  // Initialize the Select value prop properly
  const [selectedCurrency, setSelectedCurrency] = useState("");

  // checking unsupported chain for individual networks
  const isUnsupportedChain = () => {
    // chains[0] is the polygon network
    if (chain?.unsupported || chain?.id != selectedChainId) return true;
  };

  // networks data for smart posts
  const networksDataSmartPosts = () => {
    const networks = ENVIRONMENT === "production" ? [8453, 7777777] : [5]; // supported chains for Lens samart posts

    // filter the chains for smart posts
    const filteredChains = isOpenAction
      ? chains.filter((chain) => {
          return networks?.includes(chain?.id);
        })
      : chains.slice(0, -3);

    const isUnsupportedChain = () => {
      if (
        chain?.unsupported ||
        isOpenAction
        // chains.map((chain, index) => unsupportedChain.includes(chain))
      ) {
        return true;
      }
    };

    return {
      chains: filteredChains,
      isUnsupportedChain: isUnsupportedChain(),
    };
  };

  // formate date and time in uxin timestamp
  const formatDateTimeUnix = (date, time) => {
    const dateTime = new Date(`${date} ${time}`);
    return Math.floor(dateTime.getTime() / 1000);
  };

  // Calendar Functions:
  const onCalChange = (value, key) => {
    const dateTime = new Date(value);

    // Format the date
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    // Format the time
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };

    if (key.startsWith("pre")) {
      setZoraErc721Enabled({
        ...zoraErc721Enabled,
        [key]: {
          date: dateTime.toLocaleDateString(undefined, dateOptions),
          time: dateTime.toLocaleTimeString(undefined, timeOptions),
        },
      });
    } else if (key.startsWith("pub")) {
      setZoraErc721Enabled({
        ...zoraErc721Enabled,
        [key]: {
          date: dateTime.toLocaleDateString(undefined, dateOptions),
          time: dateTime.toLocaleTimeString(undefined, timeOptions),
        },
      });
    }
  };

  // funtion to add new input box for multi addresses
  const addArrlistInputBox = (key) => {
    if (key === "royaltySplitRecipients") {
      setZoraErc721Enabled({
        ...zoraErc721Enabled,
        [key]: [
          ...zoraErc721Enabled[key],
          { address: "", percentAllocation: "" },
        ],
      });
      return;
    }

    setZoraErc721Enabled({
      ...zoraErc721Enabled,
      [key]: [...zoraErc721Enabled[key], ""],
    });
  };

  // funtion to remove input box for multi addresses
  const removeArrlistInputBox = (index, key, isErrKey, errKeyMsg) => {
    setZoraErc721Enabled({
      ...zoraErc721Enabled,
      [key]: zoraErc721Enabled[key].filter((_, i) => i !== index),
    });

    if (isErrKey) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        [isErrKey]: false,
        [errKeyMsg]: "",
      });
    }
  };

  // funtion adding data for split revenues recipients
  const handleRecipientChange = (index, key, value) => {
    // check index 0 price should min 10
    if (key === "percentAllocation" && index === 0) {
      if (value < 10 || value > 100 || isNaN(value)) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltySplitError: true,
          royaltySplitErrorMessage:
            "Platform fee should be between 10% to 100%",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltySplitError: false,
          royaltySplitErrorMessage: "",
        });
      }
    } else if (key === "percentAllocation" && index !== 0) {
      // any index price should be greater min 1 and max 100
      if (value < 1 || value > 100 || isNaN(value)) {
        setZoraErc721StatesError({
          zoraErc721StatesError,
          isRoyaltySplitError: true,
          royaltySplitErrorMessage: "Split should be between 1% to 100%",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltySplitError: false,
          royaltySplitErrorMessage: "",
        });
      }
    }
    // check if recipient address is not provided
    if (key === "address") {
      if (!value) {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltySplitError: true,
          royaltySplitErrorMessage: "Recipient address is required",
        });
      } else {
        setZoraErc721StatesError({
          ...zoraErc721StatesError,
          isRoyaltySplitError: false,
          royaltySplitErrorMessage: "",
        });
      }
    }

    const updatedRecipients = [...zoraErc721Enabled.royaltySplitRecipients];
    updatedRecipients[index][key] = value;
    setZoraErc721Enabled((prevEnabled) => ({
      ...prevEnabled,
      royaltySplitRecipients: updatedRecipients,
    }));
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

  // handle for input fields
  const handleChange = (e, index, key) => {
    const { name, value } = e.target;

    setZoraErc721Enabled((prev) => {
      let updatedState = { ...prev, [name]: value };

      // Auto-fill contractSymbol based on contractName
      if (name === "contractName" && value) {
        const autoSymbol = value.substring(0, 3).toUpperCase();
        updatedState["contractSymbol"] = autoSymbol;
      }

      return updatedState;
    });

    // Perform validation
    if (name === "contractName") {
      if (!value) {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isContractNameError: true,
          contractNameErrorMessage: "Collectible Name is required",
        }));
      } else {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isContractNameError: false,
          contractNameErrorMessage: "",
        }));
      }
    } else if (name === "contractSymbol") {
      if (!value) {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isContractSymbolError: true,
          contractSymbolErrorMessage: "Collectible Symbol is required",
        }));
      } else {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isContractSymbolError: false,
          contractSymbolErrorMessage: "",
        }));
      }
    }

    if (name === "contractDescription") {
      if (!value) {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isContractDescriptionError: true,
          contractDescriptionErrorMessage:
            "Collectible Description is required",
        }));
      } else {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isContractDescriptionError: false,
          contractDescriptionErrorMessage: "",
        }));
      }
    }

    // Validation checks for other fields remain unchanged
    if (name === "chargeForMintPrice") {
      if (!value) {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isChargeForMintError: true,
          chargeForMintErrorMessage: "Price is required",
        }));
      } else if (value < 0.001) {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isChargeForMintError: true,
          chargeForMintErrorMessage: "Price must be greater than 0.001",
        }));
      } else {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isChargeForMintError: false,
          chargeForMintErrorMessage: "",
        }));
      }
    }

    if (name === "chargeForMintCurrencyAddress") {
      if (!value) {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isChargeForMintCurrencyAddressError: true,
          chargeForMintCurrencyAddressErrorMessage: "Currency is required",
        }));
      } else {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isChargeForMintCurrencyAddressError: false,
          chargeForMintCurrencyAddressErrorMessage: "",
        }));
      }
    }

    if (name === "mintLimitPerAddress") {
      if (!value) {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isMintLimitPerAddressError: true,
          limitedEditionErrorMessage: "Mint limit is required",
        }));
      } else if (value < 1) {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isMintLimitPerAddressError: true,
          limitedEditionErrorMessage: "Mint limit must be greater than 0",
        }));
      } else {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isMintLimitPerAddressError: false,
          limitedEditionErrorMessage: "",
        }));
      }
    }

    if (name === "royaltyPercent") {
      if (!value) {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isRoyaltyPercentError: true,
          royaltyPercentErrorMessage: "Royalty percent is required",
        }));
      } else if (value < 1 || value > 100) {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isRoyaltyPercentError: true,
          royaltyPercentErrorMessage: "Royalty must be between 1% to 100%",
        }));
      } else {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isRoyaltyPercentError: false,
          royaltyPercentErrorMessage: "",
        }));
      }
    }

    if (name === "maxSupply") {
      if (!value) {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isMaxSupplyError: true,
          maxSupplyErrorMessage: "Max supply is required",
        }));
      } else if (value < 1) {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isMaxSupplyError: true,
          maxSupplyErrorMessage: "Max supply must be greater than 0",
        }));
      } else {
        setZoraErc721StatesError((prev) => ({
          ...prev,
          isMaxSupplyError: false,
          maxSupplyErrorMessage: "",
        }));
      }
    }
  };

  // Sort the recipients by address in ascending order
  const sortRecipientsByAddress = (recipients) => {
    return recipients.sort((a, b) =>
      a.address
        ?.toLowerCase()
        ?.localeCompare(b.address.toLowerCase(), undefined, {
          sensitivity: "base",
        })
    );
  };

  // check if recipient address is same
  const isRecipientAddDuplicate = () => {
    const result = zoraErc721Enabled.royaltySplitRecipients.filter(
      (item, index) => {
        return (
          zoraErc721Enabled.royaltySplitRecipients.findIndex(
            (item2) => item2.address === item.address
          ) !== index
        );
      }
    );

    if (result.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  // check if recipient percentage is more than 100
  const isPercentage100 = () => {
    const result = zoraErc721Enabled.royaltySplitRecipients.reduce(
      (acc, item) => {
        return acc + item.percentAllocation;
      },
      0
    );

    setTotalPercent(result);

    if (result === 100) {
      return true;
    } else {
      return false;
    }
  };

  // split even percentage
  const splitEvenPercentage = () => {
    const result = zoraErc721Enabled.royaltySplitRecipients.map((item) => {
      return {
        address: item.address,
        percentAllocation: Math.floor(
          (100 / zoraErc721Enabled.royaltySplitRecipients.length).toFixed(2)
        ),
      };
    });

    setZoraErc721Enabled((prevEnabled) => ({
      ...prevEnabled,
      royaltySplitRecipients: result,
    }));
  };

  wagmiAdapter.transports = {
    [chain?.id]: http(),
  };

  // deploy contract
  const deployZoraContractFn = async (deployArgs) => {
    setIsDeployingZoraContract(true);

    deployZoraContractMutation(deployArgs)
      .then((res) => {
        setRespContractAddress(res?.contract_address || res?.contract);
        setIsDeployingZoraContractSuccess(true);
        setIsDeployingZoraContract(false);
        setSlug(res?.slug);
      })
      .catch((err) => {
        setIsDeployingZoraContractError(true);
        setIsDeployingZoraContract(false);
        toast.error(errorMessage(err));
      });
  };

  // mint on Zora
  const handleSubmit = () => {
    // check if canvasId is provided
    if (contextCanvasIdRef.current === null) {
      toast.error("Please select a design");
      return;
    }

    // check if collection name is provided
    if (!zoraErc721Enabled.contractName) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isContractNameError: true,
        contractNameErrorMessage: "Collectible Name is required",
      });
      return;
    }

    // check if collection description is provided
    if (!zoraErc721Enabled.contractDescription) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isContractDescriptionError: true,
        contractDescriptionErrorMessage: "Collectible Description is required",
      });
      return;
    } else if (zoraErc721StatesError.isContractDescriptionError) {
      return;
    }

    // check if collection symbol is provided
    if (!zoraErc721Enabled.contractSymbol) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isContractSymbolError: true,
        contractSymbolErrorMessage: "Collectible Symbol is required",
      });
      return;
    }

    // check if price is provided
    if (!zoraErc721Enabled.chargeForMintPrice) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isChargeForMintError: true,
        chargeForMintErrorMessage: "Price is required",
      });
      return;
    } else if (zoraErc721StatesError.isChargeForMintError) return;

    // check if royalty percent is provided
    if (!zoraErc721Enabled.royaltyPercent) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isRoyaltyPercentError: true,
        royaltyPercentErrorMessage: "Royalty percent is required",
      });
      return;
    } else if (zoraErc721StatesError.isRoyaltyPercentError) {
      return;
    }

    // check if max supply is provided
    if (!zoraErc721Enabled.maxSupply) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isMaxSupplyError: true,
        maxSupplyErrorMessage: "Max supply is required",
      });
      return;
    } else if (zoraErc721StatesError.isMaxSupplyError) {
      return;
    }

    // check if split revenue is provided
    if (zoraErc721Enabled.isRoyaltySplits) {
      if (zoraErc721StatesError.isRoyaltySplitError) return;
    } else {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isRoyaltySplitError: true,
        royaltySplitErrorMessage: "Split revenue is required",
      });
      return;
    }

    // check if recipient address is same
    if (isRecipientAddDuplicate()) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isRoyaltySplitError: true,
        royaltySplitErrorMessage: "Recipient address is duplicate",
      });
      return;
    } else if (!isPercentage100()) {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isRoyaltySplitError: true,
        royaltySplitErrorMessage: "Recipient percentage should be 100%",
      });
      return;
    } else {
      setZoraErc721StatesError({
        ...zoraErc721StatesError,
        isRoyaltySplitError: false,
        royaltySplitErrorMessage: "",
      });
    }

    const deployArgs = {
      contract_type: 721,
      chainId: chainId,
      canvasId: contextCanvasIdRef.current,
      currency: zoraErc721Enabled.chargeForMintCurrencyAddress,
      pricePerToken: priceFormatter(
        chain?.id,
        zoraErc721Enabled.chargeForMintPrice
      ),
      maxSupply: zoraErc721Enabled.maxSupply,
      args: [
        zoraErc721Enabled.contractName,
        zoraErc721Enabled.contractSymbol,
        zoraErc721Enabled.royaltyPercent * 100,
      ],
      description: zoraErc721Enabled.contractDescription,
      recipients: sortRecipientsByAddress(
        zoraErc721Enabled.royaltySplitRecipients.map((item) => ({
          address: item.address,
          percentAllocation: item.percentAllocation,
        }))
      ),
    };

    deployZoraContractFn(deployArgs);
  };

  const isSponsoredChainFn = () => {
    return isSponsoredChain?.includes(chainId);
  };

  // add recipient to the split list
  useEffect(() => {
    if (isAuthenticated) {
      const updatedRecipients = parentRecipientListRef.current.map((item) => ({
        address: item,
        percentAllocation: 1.0,
      }));

      setZoraErc721Enabled((prevEnabled) => ({
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

  // switch chain
  useEffect(() => {
    if (selectedChainId) {
      setTimeout(() => {
        switchChain({ chainId: selectedChainId });
      }, 1000);
    }
  }, [selectedChainId]);

  // error/success handling for network switch
  // useEffect(() => {
  //   if (isErrorSwitchNetwork) {
  //     console.log("isErrorSwitchNetwork", errorSwitchNetwork);
  //     toast.error(errorSwitchNetwork?.message.split("\n")[0]);
  //   }

  // if (isSuccessSwitchNetwork) {
  //   toast.success(`Network switched to ${chain?.name}`);
  // }
  // }, [isErrorSwitchNetwork]);

  console.log({ selectedChainId, chainId });

  return (
    <>
      <ZoraDialog
        title="ERC721 Edition"
        icon={chainLogo(selectedChainId)}
        isError={isDeployingZoraContractError}
        isDeployingContract={isDeployingZoraContract}
        isSuccess={isDeployingZoraContractSuccess}
        slug={slug}
      />
      {/* Switch Number 1 Start */}
      <div className=" mt-1 pt-2 pb-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Collectible Details </h2>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Set a Name and Symbol for the collectible{" "}
        </div>
      </div>

      <div className={""}>
        <div className="flex flex-col w-full py-2">
          {/* Collectible Name with Cog Icon */}
          <div className="flex items-center gap-2">
            <InputBox
              label="Collectible Name"
              name="contractName"
              onChange={handleChange}
              onFocus={handleChange}
              value={zoraErc721Enabled.contractName}
            />
            <FiSettings
              className="cursor-pointer text-gray-500 hover:text-gray-700"
              size={20}
              onClick={() => setShowSymbol((prev) => !prev)}
            />
          </div>
          {zoraErc721StatesError.isContractNameError && (
            <InputErrorMsg
              message={zoraErc721StatesError.contractNameErrorMessage}
            />
          )}

          {/* Collectible Symbol (Hidden Initially) */}
          {showSymbol && (
            <div className="mt-2">
              <InputBox
                label="Collectible Symbol"
                name="contractSymbol"
                onChange={handleChange}
                value={zoraErc721Enabled.contractSymbol}
              />
              {zoraErc721StatesError.isContractSymbolError && (
                <InputErrorMsg
                  message={zoraErc721StatesError.contractSymbolErrorMessage}
                />
              )}
            </div>
          )}

          {/* Collectible Description */}
          <div className="mt-2">
            <Textarea
              label="Collectible Description"
              name="contractDescription"
              onChange={handleChange}
              value={zoraErc721Enabled.contractDescription || ""}
            />
          </div>
          {zoraErc721StatesError.isContractSymbolError && (
            <InputErrorMsg
              message={zoraErc721StatesError.contractSymbolErrorMessage}
            />
          )}
        </div>
      </div>

      <div className="mb-4 mt-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Mint Price</h2>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Set an amount to be charged for minting{" "}
        </div>
      </div>

      <div className="flex">
        <div className="flex flex-col py-2">
          <NumberInputBox
            min={"0.001"}
            step={"0.01"}
            label="Price"
            name="chargeForMintPrice"
            onChange={(e) => handleChange(e)}
            onFocus={(e) => handleChange(e)}
            value={zoraErc721Enabled.chargeForMintPrice}
          />
        </div>

        <div className="flex flex-col py-2 mx-2">
          {TOKEN_LIST[chain?.name] && (
            <Select
              animate={{
                mount: { y: 0 },
                unmount: { y: 25 },
              }}
              label="Currency"
              name="chargeForMintCurrency"
              id="chargeForMintCurrency"
              value={selectedCurrency?.symbol || ""}
            >
              {TOKEN_LIST[chain?.name] &&
                TOKEN_LIST[chain?.name]?.map((currency) => (
                  <Option
                    key={currency?.id}
                    onClick={() => {
                      setSelectedCurrency(currency);
                      setZoraErc721Enabled({
                        ...zoraErc721Enabled,
                        chargeForMintCurrencySymbol: currency?.symbol,
                        chargeForMintCurrencyAddress: currency?.address,
                      });
                    }}
                  >
                    <div className="flex items-center gap-1">
                      <Avatar
                        variant="circular"
                        alt={currency?.symbol}
                        src={currency?.logoURI}
                        className="w-6 h-6"
                      />
                      <Typography variant="small">{currency?.name}</Typography>
                    </div>
                  </Option>
                ))}
            </Select>
          )}
        </div>
      </div>

      {zoraErc721StatesError.isChargeForMintError && (
        <InputErrorMsg
          message={zoraErc721StatesError.chargeForMintErrorMessage}
        />
      )}

      {/* Switch Number 1 End */}

      {/* Splits Switch Start */}

      <div className="mb-4 mt-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Split Recipients </h2>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Split revenue between multiple recipients{" "}
        </div>
      </div>

      <div className={`${!zoraErc721Enabled.isRoyaltySplits && "hidden"}`}>
        <div className="">
          {zoraErc721Enabled.royaltySplitRecipients.map((recipient, index) => {
            return (
              <div
                key={index}
                className="flex justify-between gap-2 items-center w-full py-2"
              >
                <div className="flex-1">
                  <AddressInputWithENS
                    label="Wallet Address"
                    value={recipientsEns[index] || recipient.address}
                    onFocus={(e) =>
                      restrictRecipientInput(e, index, recipient.address)
                    }
                    onChange={(e) =>
                      restrictRecipientInput(e, index, recipient.address)
                    }
                  />
                </div>
                <div className="">
                  <NumberInputBox
                    min={0}
                    max={100}
                    step={1}
                    label="%"
                    value={recipient.percentAllocation}
                    onFocus={(e) => {
                      handleRecipientChange(
                        index,
                        "percentAllocation",
                        Number(parseFloat(e.target.value).toFixed(4))
                      );
                    }}
                    onChange={(e) => {
                      handleRecipientChange(
                        index,
                        "percentAllocation",
                        Number(parseFloat(e.target.value).toFixed(4))
                      );
                    }}
                  />
                </div>
                {!restrictRemoveRecipientInputBox(index, recipient.address) && (
                  <span>
                    <FiXCircle
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
                  </span>
                )}
              </div>
            );
          })}

          <div className="flex justify-between items-center">
            {zoraErc721StatesError.isRoyaltySplitError && (
              <>
                <InputErrorMsg
                  message={zoraErc721StatesError.royaltySplitErrorMessage}
                />
                <Typography variant="h6" color="blue-gray">
                  {totalPercent} %
                </Typography>
              </>
            )}
          </div>

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
      {/* Splits Switch End */}

      {/* royalty switch start */}
      <>
        <div className="mb-4 mt-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Royalty </h2>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set Royalty percentage for minting{" "}
          </div>
        </div>

        <div className={`${!zoraErc721Enabled.isRoyaltyPercent && "hidden"}`}>
          {/* <div className="flex"> */}
          <div className="flex flex-col py-2">
            <NumberInputBox
              min={"1"}
              step={"1"}
              label="Royalty % "
              name="royaltyPercent"
              onChange={(e) => handleChange(e)}
              onFocus={(e) => handleChange(e)}
              value={zoraErc721Enabled.royaltyPercent}
            />
          </div>
          {/* </div> */}

          {zoraErc721StatesError.isRoyaltyPercentError && (
            <InputErrorMsg
              message={zoraErc721StatesError.royaltyPercentErrorMessage}
            />
          )}
        </div>
      </>
      {/* royalty switch end */}

      {/* Switch Number 6 Start */}
      <>
        <div className="mb-4 mt-4">
          <div className="flex justify-between">
            <h2 className="text-lg mb-2"> Supply </h2>
          </div>
          <div className="w-4/5 opacity-75">
            {" "}
            Set the maximum supply limit for the mint{" "}
          </div>
        </div>

        <div className="flex flex-col py-2">
          <NumberInputBox
            min={"1"}
            step={"1"}
            // className={"W-3/4"}
            label="Max Supply "
            name="maxSupply"
            onChange={(e) => handleChange(e)}
            onFocus={(e) => handleChange(e)}
            value={zoraErc721Enabled.maxSupply}
          />
        </div>

        {zoraErc721StatesError.isMaxSupplyError && (
          <InputErrorMsg
            message={zoraErc721StatesError.maxSupplyErrorMessage}
          />
        )}
      </>
      {/* Switch Number 6 End */}

      {/* Topup start */}
      <div className="mb-4 mt-4">
        {/* {isSponsoredChainFn() ? ( */}
        <>
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
                {walletData?.balance} {chain?.nativeCurrency?.symbol}{" "}
              </span>
            )}
          </p>
        </>
        {/* ) : null} */}
        {zoraErc721Enabled.maxSupply > walletData?.sponsored && (
          <Topup
            topUpAccount={walletData?.publicAddress}
            balance={walletData?.balance}
            refetchWallet={refetchWallet}
            sponsored={walletData?.sponsored}
            isCustomCurrMintOption={true}
          />
        )}
      </div>

      {/* Topup end */}

      {/* network */}
      {getEVMAuth && (isFarcaster || isOpenAction) ? (
        <>
          <h2 className="text-lg"> Switch Networks </h2>
          <Networks
            className="w-[95%] outline-none mb-2"
            chains={chains}
            isUnsupportedChain={selectedChainId}
          />
        </>
      ) : null}

      {!getEVMAuth ? (
        actionType != "framev2" && (
          <EVMWallets
            title="Login with EVM"
            login={login}
            className="w-[97%]"
          />
        )
      ) : isFarcaster && !isFarcasterAuth ? (
        <FarcasterAuth />
      ) : isOpenAction && !lensAuth?.profileHandle ? (
        <LensAuth title="Login with Lens" className="w-[95%] outline-none" />
      ) : isOpenAction && !dispatcher ? (
        <LensDispatcher
          title="Enable signless transactions"
          className="w-[95%] outline-none"
        />
      ) : !isFarcaster && !isOpenAction && isUnsupportedChain() ? (
        <div className="outline-none">
          <Button
            className="w-full outline-none flex justify-center items-center gap-2"
            disabled={isLoadingSwitchNetwork}
            onClick={() => switchChain({ chainId: selectedChainId })}
            color="red"
          >
            {isLoadingSwitchNetwork ? "Switching" : "Switch"} to{" "}
            {chains.find((i) => i.id === selectedChainId)?.name
              ? chains.find((i) => i.id === selectedChainId)?.name
              : "a suported"}{" "}
            Network {isLoadingSwitchNetwork && <Spinner />}
          </Button>
        </div>
      ) : (
        <div className="">
          <Button
            disabled={networksDataSmartPosts()?.isUnsupportedChain}
            fullWidth
            // color="yellow"
            onClick={handleSubmit}
          >
            {" "}
            Create Edition{" "}
          </Button>
        </div>
      )}
    </>
  );
};

export default LP721Edition;
