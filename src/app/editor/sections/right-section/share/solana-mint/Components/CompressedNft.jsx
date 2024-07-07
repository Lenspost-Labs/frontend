import React, { useState } from "react";
import { InputBox, InputErrorMsg, NumberInputBox } from "../../../../../common";
import BsPlus from "@meronex/icons/bs/BsPlus";
import { Button, Option, Select } from "@material-tailwind/react";
import { DateTimePicker } from "@atlaskit/datetime-picker";
import { useContext } from "react";
import { useEffect } from "react";
import { Switch } from "@headlessui/react";
import { Context } from "../../../../../../../providers/context";
import { APP_SOLANA_ADDRESS, LOCAL_STORAGE } from "../../../../../../../data";
import { SolanaWallets } from "../../../../top-section/auth/wallets";
import {
  errorMessage,
  getFromLocalStorage,
  jsConfettiFn,
} from "../../../../../../../utils";
import { toast } from "react-toastify";
import { shareOnSocials } from "../../../../../../../services";
import { useMutation } from "@tanstack/react-query";
import TiDelete from "@meronex/icons/ti/TiDelete";
import { XCircleIcon } from "@heroicons/react/24/outline";
import { useSolanaWallet } from "../../../../../../../hooks/solana";
import { useAppAuth, useReset } from "../../../../../../../hooks/app";
import {
  clusterApiUrl,
  Keypair,
  Connection,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import base58 from "bs58";
import { SwitchGroup, SharePanelHeaders } from "../../components";
import { createBLinks } from "../../../../../../../services/apis/BE-apis";

const CompressedNft = () => {
  const { solanaAddress, solanaSignTransaction } = useSolanaWallet();
  const [sharing, setSharing] = useState(false);
  const getSolanaAuth = getFromLocalStorage(LOCAL_STORAGE.solanaAuth);
  const { isAuthenticated } = useAppAuth();
  const [solanaMasterEditionData, setSolanaMasterEditionData] = useState({
    tx: "",
    mintId: "",
  });

  const {
    postName,
    solanaEnabled,
    setSolanaEnabled,
    postDescription,
    setPostDescription,
    contextCanvasIdRef,
    parentRecipientListRef,
    setMenu,
    setIsShareOpen,
    setDialogOpen,
    setExplorerLink,
    solanaStatesError,
    setSolanaStatesError,
  } = useContext(Context);
  const { resetState } = useReset();

  const { mutateAsync: shareOnSolana } = useMutation({
    mutationKey: "shareOnSolana",
    mutationFn: shareOnSocials,
  });

  const { mutateAsync: createBlinksMutation } = useMutation({
    mutationKey: "createBLinks",
    mutationFn: createBLinks,
  });

  // formate date and time in ISO 8601 format for monatizationn settings
  const formatDateTimeISO8601 = (date, time) => {
    if (!date || !time) return;
    const dateTime = new Date(`${date} ${time}`);
    return dateTime.toISOString();
  };

  const mintSettings = (platform) => {
    // TODO: check if here needs to be any checks

    let canvasParams = {};

    if (platform === "solana-cnft") {
      canvasParams = {
        ...canvasParams,
        creators: solanaEnabled.onChainSplitRecipients,
      };

      if (solanaEnabled.isSellerFeeBasisPoints) {
        canvasParams = {
          ...canvasParams,
          sellerFeeBasisPoints: solanaEnabled.sellerFeeBasisPoints * 100,
        };
      }
    }

    return canvasParams;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "chargeForMintPrice") {
      if (value < 0.1) {
        setSolanaStatesError({
          ...solanaStatesError,
          isChargeForMintError: true,
          chargeForMintErrorMessage: "Price should be greater than 0.1",
        });
      } else {
        setSolanaStatesError({
          ...solanaStatesError,
          isChargeForMintError: false,
          chargeForMintErrorMessage: "",
        });
      }
    } else if (name === "sellerFeeBasisPoints") {
      if (value < 1 || value > 100) {
        setSolanaStatesError({
          ...solanaStatesError,
          isSellerFeeError: true,
          sellerFeeErrorMessage: "Royalty should be between 1% to 100%",
        });
      } else {
        setSolanaStatesError({
          ...solanaStatesError,
          isSellerFeeError: false,
          sellerFeeErrorMessage: "",
        });
      }
    }

    setSolanaEnabled((prevEnabled) => ({ ...prevEnabled, [name]: value }));
  };

  // funtions adding data for multi addresses
  const handleArrlistChange = (index, value, key) => {
    setSolanaEnabled((prevEnabled) => ({
      ...prevEnabled,
      [key]: prevEnabled[key].map((item, i) => (i === index ? value : item)),
    }));
  };

  // funtions for adding new input box for multi addresses
  const addArrlistInputBox = (key) => {
    setSolanaEnabled({
      ...solanaEnabled,
      [key]: [...solanaEnabled[key], ""],
    });
  };

  // funtions for removing input box for multi addresses
  const removeArrlistInputBox = (index, key) => {
    setSolanaEnabled({
      ...solanaEnabled,
      [key]: solanaEnabled[key].filter((_, i) => i !== index),
    });
  };

  // funtions adding data for split revenues recipients
  const handleRecipientChange = (index, key, value) => {
    // check index 0 price should min 10
    if (key === "share" && index === 0) {
      if (value < 10 || value > 100 || isNaN(value)) {
        setSolanaStatesError({
          ...solanaStatesError,
          isSplitError: true,
          splitErrorMessage: "Platform fee should be between 10% to 100%",
        });
      } else {
        setSolanaStatesError({
          ...solanaStatesError,
          isSplitError: false,
          splitErrorMessage: "",
        });
      }
    }

    // any index price should be greater min 1 and max 100
    if (key === "share" && index !== 0) {
      if (value < 1 || value > 100 || isNaN(value)) {
        setSolanaStatesError({
          ...solanaStatesError,
          isSplitError: true,
          splitErrorMessage: "Split should be between 1% to 100%",
        });
      } else {
        setSolanaStatesError({
          ...solanaStatesError,
          isSplitError: false,
          splitErrorMessage: "",
        });
      }
    }

    // check if the address is not same

    const updatedRecipients = [...solanaEnabled.onChainSplitRecipients];
    updatedRecipients[index][key] = value;
    setSolanaEnabled((prevEnabled) => ({
      ...prevEnabled,
      onChainSplitRecipients: updatedRecipients,
    }));
  };

  // funtions for adding new input box for split revenue
  const addRecipientInputBox = () => {
    setSolanaEnabled({
      ...solanaEnabled,
      onChainSplitRecipients: [
        ...solanaEnabled.onChainSplitRecipients,
        {
          address: "",
          share: null,
        },
      ],
    });
  };

  // funtions for removing input box for split revenue
  const removeRecipientInputBox = (index) => {
    const updatedRecipients = solanaEnabled.onChainSplitRecipients.filter(
      (_, i) => i !== index
    );

    setSolanaEnabled({
      ...solanaEnabled,
      onChainSplitRecipients: updatedRecipients,
    });

    setSolanaStatesError({
      ...solanaStatesError,
      isSplitError: false,
      splitErrorMessage: "",
    });
  };

  // restrict the input box if the recipient is in the parent list
  const restrictRecipientInput = (e, index, recipient) => {
    const isRecipient = parentRecipientListRef.current.includes(recipient);
    const isUserAddress = recipient === solanaAddress;
    if (index === 0 || isRecipient) {
      if (isUserAddress) {
        handleRecipientChange(index, "address", e.target.value);
      }
    } else {
      handleRecipientChange(index, "address", e.target.value);
    }
  };

  // restrict ther delete button if recipient is in the parent list
  const restrictRemoveRecipientInputBox = (index, recipient) => {
    const isRecipient = parentRecipientListRef.current.includes(recipient);
    if (index === 0 || isRecipient) {
      return true;
    }
  };

  // Calendar Functions:
  const onCalChange = (value) => {
    const dateTime = new Date(value);

    // Format the date
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };

    // Format the time
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };

    // TODO-FIX: both start and end time is same
    setSolanaEnabled({
      ...solanaEnabled,
      startTimeStamp: {
        date: dateTime.toLocaleDateString(undefined, dateOptions),
        time: dateTime.toLocaleTimeString(undefined, timeOptions),
      },
      endTimestamp: {
        date: dateTime.toLocaleDateString(undefined, dateOptions),
        time: dateTime.toLocaleTimeString(undefined, timeOptions),
      },
    });
  };

  // check if recipient address is same
  const isAddressDuplicate = () => {
    const arr = solanaEnabled.onChainSplitRecipients;
    let isError = false;
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length; j++) {
        if (i !== j && arr[i].address === arr[j].address) {
          isError = true;
          break;
        }
      }
    }

    return isError;
  };

  // check if recipient percentage is more than 100
  const isPercentage100 = () => {
    const result = solanaEnabled.onChainSplitRecipients.reduce((acc, item) => {
      return acc + item.share;
    }, 0);

    if (result == 100) {
      return true;
    } else {
      return false;
    }
  };

  // split even percentage
  const splitEvenPercentage = () => {
    const result = solanaEnabled.onChainSplitRecipients.map((item) => ({
      address: item.address,
      share: Math.floor(
        (100 / solanaEnabled.onChainSplitRecipients.length).toFixed(2)
      ),
    }));

    setSolanaEnabled((prevEnabled) => ({
      ...prevEnabled,
      onChainSplitRecipients: result,
    }));
  };

  // mint on solana
  const sharePost = (platform) => {
    // TODO:  enables some checks here

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

    if (solanaEnabled.isSellerFeeBasisPoints) {
      if (solanaStatesError.isSellerFeeError) return;
    }

    if (solanaStatesError.isSplitError) return;

    if (isAddressDuplicate()) {
      setSolanaStatesError({
        ...solanaStatesError,
        isSplitError: true,
        splitErrorMessage: "Duplicate address or handle found",
      });
      return;
    } else if (!isPercentage100()) {
      setSolanaStatesError({
        ...solanaStatesError,
        isSplitError: true,
        splitErrorMessage: "Total split should be 100%",
      });
      return;
    } else {
      setSolanaStatesError({
        ...solanaStatesError,
        isSplitError: false,
        splitErrorMessage: "",
      });
    }

    // return;
    setSharing(true);

    const canvasData = {
      id: contextCanvasIdRef.current,
      name: postName,
      content: postDescription,
    };

    const id = toast.loading(`Sharing on ${platform}...`);
    shareOnSolana({
      canvasData: canvasData,
      canvasParams: mintSettings(platform),
      platform: platform,
    })
      .then((res) => {
        if (res?.assetId || res?.tx || res?.data) {
          toast.update(id, {
            render: `Successfully created the edition`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });

          // open explorer link
          if (res?.assetId) {
            setExplorerLink(res?.assetId);
            setDialogOpen(true);
          } else if (res?.data) {
            setSolanaMasterEditionData({
              tx: res?.data,
              mintId: res?.mintId,
            });
          }
        } else {
          toast.update(id, {
            render: `Error sharing on ${platform}`,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
          setSharing(false);
        }
      })
      .catch((err) => {
        toast.update(id, {
          render: errorMessage(err),
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        setSharing(false);
      });
  };

  const handleCreateBlink = () => {
    const id = toast.loading(`Creating Blink...`);

    const params = {
      name: postName,
      content: postDescription,
      symbol: postName?.split(" ")[0].toUpperCase(),
      sellerFeeBasisPoints: solanaEnabled.sellerFeeBasisPoints * 100,
      image:
        "https://frames.poster.fun/_next/image?url=https%3A%2F%2Flenspost.b-cdn.net%2Fuser%2F109%2Fcanvases%2F13016-0.png&w=3840&q=75",
      creators: solanaEnabled.onChainSplitRecipients,
      owner: solanaAddress,
    };

    createBlinksMutation(params)
      .then((res) => {
        if (res?.status === "success") {
          toast.update(id, {
            render: `Successfully created the Blink`,
            type: "success",
            isLoading: false,
            autoClose: 3000,
          });
        } else {
          toast.update(id, {
            render: `Error creating Blink`,
            type: "error",
            isLoading: false,
            autoClose: 3000,
          });
        }
      })
      .catch((err) => {
        toast.update(id, {
          render: errorMessage(err),
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
      });
  };

  // add recipient to the split list
  useEffect(() => {
    if (isAuthenticated) {
      const updatedRecipients = parentRecipientListRef.current.map((item) => ({
        address: item,
        share: 1.0,
      }));

      setSolanaEnabled((prevEnabled) => ({
        ...prevEnabled,
        onChainSplitRecipients: [
          {
            address: APP_SOLANA_ADDRESS,
            share: solanaEnabled.onChainSplitRecipients[0].share || 10.0,
          },
          ...updatedRecipients,
        ],
      }));
    }
  }, [isAuthenticated]);

  return (
    <div className=" w-full p-2">
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Split Pecipients </h2>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Split between multiple recipients{" "}
        </div>
      </div>

      <div className={`${!solanaEnabled.isOnChainSplits && "hidden"}`}>
        <div className="mx-4">
          {solanaEnabled.onChainSplitRecipients.map((recipient, index) => {
            return (
              <>
                <div
                  key={index}
                  className="flex justify-between gap-2 items-center w-full py-2"
                >
                  <InputBox
                    className="w-full"
                    label="Wallet Address"
                    value={recipient.address}
                    onChange={(e) =>
                      restrictRecipientInput(e, index, recipient.address)
                    }
                  />
                  <div className="flex justify-between items-center w-1/3">
                    <NumberInputBox
                      className="w-4"
                      min={0}
                      max={100}
                      step={1}
                      label="%"
                      value={recipient.share}
                      onChange={(e) => {
                        handleRecipientChange(
                          index,
                          "share",
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
                        onClick={() => removeRecipientInputBox(index)}
                      />
                    )}
                  </div>
                </div>
              </>
            );
          })}

          {solanaStatesError.isSplitError && (
            <InputErrorMsg message={solanaStatesError.splitErrorMessage} />
          )}

          <div className="flex justify-between">
            <Button
              color="yellow"
              size="sm"
              variant="filled"
              className="flex items-center gap-3 mt-2 ml-0 mr-4 "
              onClick={addRecipientInputBox}
            >
              <BsPlus />
              Add Recipient
            </Button>
            <Button
              color="yellow"
              size="sm"
              variant="filled"
              className="flex items-center gap-3 mt-2 ml-0 outline-none"
              onClick={splitEvenPercentage}
            >
              Split Even
            </Button>
          </div>
        </div>
      </div>

      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Royalty </h2>
        </div>
        <div className="w-4/5 opacity-75"> Seller fee basis point </div>
      </div>

      <div
        className={`${
          !solanaEnabled.isSellerFeeBasisPoints && "hidden"
        } ml-4 mr-4`}
      >
        <div className="flex flex-col w-full py-2">
          {/* <label htmlFor="price">Collect limit</label> */}
          <NumberInputBox
            step={1}
            label="Seller Fees"
            name="sellerFeeBasisPoints"
            onChange={(e) => handleChange(e)}
            value={solanaEnabled.sellerFeeBasisPoints}
            onFocus={(e) => handleChange(e)}
          />
          {solanaStatesError.isSellerFeeError && (
            <InputErrorMsg message={solanaStatesError.sellerFeeErrorMessage} />
          )}
        </div>
      </div>

      {/* Switch Number 7 End */}
      {getSolanaAuth ? (
        <div className="flex flex-col gap-2">
          <Button
            disabled={sharing}
            onClick={() => sharePost("solana-cnft")}
            color="yellow"
            className="w-full"
          >
            {" "}
            Mint as cNFT{" "}
          </Button>
          <Button
            disabled={sharing}
            onClick={handleCreateBlink}
            color="yellow"
            className="w-full"
          >
            {" "}
            Create Blink{" "}
          </Button>
        </div>
      ) : (
        <SolanaWallets title="Login with Solana" className="w-full" />
      )}
    </div>
  );
};

export default CompressedNft;
