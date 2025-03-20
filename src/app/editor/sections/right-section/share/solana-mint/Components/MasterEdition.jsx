import React, { useState } from "react";
import { SharePanelHeaders } from "../../components";
import { SwitchGroup } from "../../components";
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
import FiXCircle from "@meronex/icons/fi/FiXCircle";
import { useSolanaWallet } from "../../../../../../../hooks/solana";
import { useAppAuth, useReset } from "../../../../../../../hooks/app";
import {
  clusterApiUrl,
  Keypair,
  Connection,
  Transaction,
  VersionedTransaction,
  TransactionInstruction,
  PublicKey,
} from "@solana/web3.js";
import bs58 from "bs58";
import { InputBox, InputErrorMsg, NumberInputBox } from "../../../../../common";
import { useWallet } from "@solana/wallet-adapter-react";

const MasterEdition = () => {
  const { solanaAddress, solanaSignTransaction, solanaPublicKey } =
    useSolanaWallet();
  const { wallet, signTransaction } = useWallet();
  const [sharing, setSharing] = useState(false);
  const getSolanaAuth = getFromLocalStorage(LOCAL_STORAGE.solanaAuth);
  const { isAuthenticated } = useAppAuth();
  const [solanaMasterEditionData, setSolanaMasterEditionData] = useState({
    tx: "",
    mintId: "",
  });

  const {
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
          seller_fee_basis_points: solanaEnabled.sellerFeeBasisPoints,
        };
      }
    }

    if (platform === "solana-master") {
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

      if (solanaEnabled.isChargeForMint) {
        canvasParams = {
          ...canvasParams,
          amount: solanaEnabled.chargeForMintPrice,
          symbol: solanaEnabled.chargeForMintCurrency,
        };
      }

      if (solanaEnabled.isLimitedEdition) {
        canvasParams = {
          ...canvasParams,
          itemsAvailable: solanaEnabled.limitedEditionNumber,
        };
      }

      if (solanaEnabled.isTimeLimit) {
        canvasParams = {
          ...canvasParams,
          guards: {
            ...canvasParams.guards,
            startDate: formatDateTimeISO8601(
              solanaEnabled.startTimeStamp.date,
              solanaEnabled.startTimeStamp.time
            ),
            endDate: formatDateTimeISO8601(
              solanaEnabled.endTimestamp.date,
              solanaEnabled.endTimestamp.time
            ),
          },
        };
      }

      if (solanaEnabled.isAllowlist) {
        canvasParams = {
          ...canvasParams,
          guards: {
            ...canvasParams.guards,
            allowList: solanaEnabled.allowlistAddresses,
          },
        };
      }

      if (solanaEnabled.isNftBurnable) {
        canvasParams = {
          ...canvasParams,
          guards: {
            ...canvasParams.guards,
            nftBurn: solanaEnabled.nftBurnableContractAddresses,
          },
        };
      }

      if (solanaEnabled.isNftGate) {
        canvasParams = {
          ...canvasParams,
          guards: {
            ...canvasParams.guards,
            nftGate: solanaEnabled.nftGateContractAddresses,
          },
        };
      }

      if (solanaEnabled.isTokenGate) {
        canvasParams = {
          ...canvasParams,
          guards: {
            ...canvasParams.guards,
            tokenGate: solanaEnabled.tokenGateContractAddresses,
          },
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
    } else if (name === "limitedEditionNumber") {
      if (value < 1) {
        setSolanaStatesError({
          ...solanaStatesError,
          isLimitedEditionError: true,
          limitedEditionErrorMessage: "Minimum edition should be 1",
        });
      } else {
        setSolanaStatesError({
          ...solanaStatesError,
          isLimitedEditionError: false,
          limitedEditionErrorMessage: "",
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

    if (solanaEnabled.isChargeForMint) {
      if (solanaStatesError.isChargeForMintError) return;
    }

    if (solanaEnabled.isSellerFeeBasisPoints) {
      if (solanaStatesError.isSellerFeeError) return;
    }

    if (solanaEnabled.isLimitedEdition) {
      if (solanaStatesError.isLimitedEditionError) return;
    }

    if (solanaEnabled.isTimeLimit) {
      if (solanaStatesError.isTimeLimitError) return;
    }

    if (solanaEnabled.isAllowlist) {
      if (solanaStatesError.isAllowlistError) return;
    }

    if (solanaEnabled.isNftBurnable) {
      if (solanaStatesError.isNftBurnableError) return;
    }

    if (solanaEnabled.isNftGate) {
      if (solanaStatesError.isNftGateError) return;
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

    setSharing(true);

    const canvasData = {
      id: contextCanvasIdRef.current,
      name: "solana post",
      content: postDescription,
    };

    const id = toast.loading(`Sharing on ${platform}...`);
    shareOnSolana({
      canvasData: canvasData,
      canvasParams: mintSettings(platform),
      platform: platform,
      // timeStamp: formatDateTimeUnix(stFormattedDate, stFormattedTime),
    })
      .then((res) => {
        if (res?.assetId || res?.tx || res?.data) {
          // jsConfettiFn();

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
            // setExplorerLink("https://mint.lenspost.xyz/" + res?.tx);
            // setDialogOpen(true);
          }

          // TODO: clear all the states and variables
          resetState();
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

  // function for sign the transaction for solana master edition
  function getRawTransaction(encodedTx) {
    let recoveredTx;
    try {
      recoveredTx = Transaction.from(Buffer.from(encodedTx, "base64"));
    } catch (e) {
      recoveredTx = VersionedTransaction.deserialize(
        Buffer.from(encodedTx, "base64")
      );
    }
    return recoveredTx;
  }

  const signTx = async (txBase64) => {
    const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

    // Retrieve the raw transaction
    const recoveredTx = getRawTransaction(txBase64);
    console.log("recoveredTx:", recoveredTx);

    // Sign the transaction using Phantom wallet
    const signedTx = await signTransaction(recoveredTx);
    console.log("signedTx:", signedTx);

    if (!signedTx?.signature) {
      return toast.error("Transaction not signed!");
    }

    const signature = bs58.encode(signedTx?.signature);
    console.log("signatures:", signature);

    if (!signedTx?.verifySignatures()) {
      return toast.error("Transaction signature invalid!");
    }

    toast.success("Transaction signature valid!");
  };

  useEffect(() => {
    if (solanaMasterEditionData.tx) {
      console.log("solanaMasterEditionData:", solanaMasterEditionData.tx);
      signTx(solanaMasterEditionData?.tx);
    }
  }, [solanaMasterEditionData]);

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
    <div className="w-full p-2">
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Charge for mint </h2>
          {/* <Switch
            checked={solanaEnabled.isChargeForMint}
            onChange={() =>
              setSolanaEnabled({
                ...solanaEnabled,
                isChargeForMint: !solanaEnabled.isChargeForMint,
              })
            }
            className={`${
              solanaEnabled.isChargeForMint ? "bg-[#ffeb3b]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffeb3b] focus:ring-offset-2`}
          >
            <span
              className={`${
                solanaEnabled.isChargeForMint
                  ? "translate-x-6"
                  : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch> */}
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Set an amount to be charged for minting{" "}
        </div>
      </div>

      <div className={`${!solanaEnabled.isChargeForMint && "hidden"} mx-4`}>
        <div className="flex gap-5">
          <div className="flex flex-col py-2">
            <NumberInputBox
              min={"0.1"}
              step={"0.01"}
              // className={"W-3/4"}
              label="Price"
              name="chargeForMintPrice"
              value={solanaEnabled.chargeForMintPrice}
              onChange={(e) => handleChange(e)}
              onFocus={(e) => handleChange(e)}
            />
          </div>
          <div className="flex flex-col py-2">
            <Select
              label="Currency"
              name="chargeForMintCurrency"
              id="chargeForMintCurrency"
              value={solanaEnabled.chargeForMintCurrency}
            >
              {["SOL"].map((currency, index) => (
                <Option
                  key={currency}
                  onClick={() => {
                    setSolanaEnabled({
                      ...solanaEnabled,
                      chargeForMintCurrency: currency,
                    });
                  }}
                >
                  {currency}
                </Option>
              ))}
            </Select>
          </div>
        </div>
        {solanaStatesError.isChargeForMintError && (
          <InputErrorMsg
            message={solanaStatesError.chargeForMintErrorMessage}
          />
        )}
      </div>

      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Split Pecipients </h2>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Split between multiple recipients{" "}
        </div>
      </div>

      {/* {enabled.onChainSplits && ( */}
      <div className={`${!solanaEnabled.isOnChainSplits && "hidden"}`}>
        <div className="mx-4">
          {solanaEnabled.onChainSplitRecipients.map((recipient, index) => {
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
                    value={recipient.address}
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
                      <FiXCircle
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
          <h2 className="text-lg mb-2"> Seller Fees </h2>
          {/* <Switch
            checked={solanaEnabled.isSellerFeeBasisPoints}
            onChange={() =>
              setSolanaEnabled({
                ...solanaEnabled,
                isSellerFeeBasisPoints: !solanaEnabled.isSellerFeeBasisPoints,
              })
            }
            className={`${
              solanaEnabled.isSellerFeeBasisPoints
                ? "bg-[#ffeb3b]"
                : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffeb3b] focus:ring-offset-2`}
          >
            <span
              className={`${
                solanaEnabled.isSellerFeeBasisPoints
                  ? "translate-x-6"
                  : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch> */}
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
            onFocus={(e) => handleChange(e)}
            value={solanaEnabled.sellerFeeBasisPoints}
          />
          {solanaStatesError.isSellerFeeError && (
            <InputErrorMsg message={solanaStatesError.sellerFeeErrorMessage} />
          )}
        </div>
      </div>
      {/* )} */}
      {/* Switch Number 2 End */}
      {/* Working End */}

      {/* Switch Number 3 Start */}
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Limit number of editions </h2>
          {/* <Switch
            checked={solanaEnabled.isLimitedEdition}
            onChange={() =>
              setSolanaEnabled({
                ...solanaEnabled,
                isLimitedEdition: !solanaEnabled.isLimitedEdition,
              })
            }
            className={`${
              solanaEnabled.isLimitedEdition ? "bg-[#ffeb3b]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffeb3b] focus:ring-offset-2`}
          >
            <span
              className={`${
                solanaEnabled.isLimitedEdition
                  ? "translate-x-6"
                  : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch> */}
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Limit the number of editions that can be minted{" "}
        </div>
      </div>

      <div
        className={`${!solanaEnabled.isLimitedEdition && "hidden"} ml-4 mr-4`}
      >
        <div className="flex flex-col w-full py-2">
          <NumberInputBox
            min={"1"}
            step={"1"}
            label="Collect limit"
            name="limitedEditionNumber"
            onChange={(e) => handleChange(e)}
            onFocus={(e) => handleChange(e)}
            value={solanaEnabled.limitedEditionNumber}
          />
          {solanaStatesError.isLimitedEditionError && (
            <InputErrorMsg
              message={solanaStatesError.limitedEditionErrorMessage}
            />
          )}
        </div>
      </div>
      {/* Switch Number 3 End */}

      {/* Switch Number 4 Start */}
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Schedule your Mint </h2>
          <Switch
            checked={solanaEnabled.isTimeLimit}
            onChange={() =>
              setSolanaEnabled({
                ...solanaEnabled,
                isTimeLimit: !solanaEnabled.isTimeLimit,
              })
            }
            className={`${
              solanaEnabled.isTimeLimit ? "bg-[#ffeb3b]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffeb3b] focus:ring-offset-2`}
          >
            <span
              className={`${
                solanaEnabled.isTimeLimit ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Set a start and end date for your mint{" "}
        </div>
      </div>

      <div
        className={`flex flex-col ${!solanaEnabled.isTimeLimit && "hidden"} `}
      >
        <div className="ml-4 mr-4 flex justify-between text-center align-middle">
          <div>Start</div> <DateTimePicker onChange={onCalChange} />
        </div>
        <div className="m-4 flex justify-between text-center align-middle">
          <div>End</div> <DateTimePicker onChange={onCalChange} />
        </div>

        {solanaStatesError.isTimeLimitError && (
          <InputErrorMsg message={solanaStatesError.timeLimitErrorMessage} />
        )}
      </div>

      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Allowlist </h2>
          <Switch
            checked={solanaEnabled.isAllowlist}
            onChange={() =>
              setSolanaEnabled({
                ...solanaEnabled,
                isAllowlist: !solanaEnabled.isAllowlist,
              })
            }
            className={`${
              solanaEnabled.isAllowlist ? "bg-[#ffeb3b]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffeb3b] focus:ring-offset-2`}
          >
            <span
              className={`${
                solanaEnabled.isAllowlist ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Allow specific wallet addresses to mint{" "}
        </div>
      </div>

      <div className={`ml-4 mr-4 ${!solanaEnabled.isAllowlist && "hidden"} `}>
        {solanaEnabled.allowlistAddresses.map((recipient, index) => {
          return (
            <>
              <div
                key={index}
                className="flex justify-between gap-2 items-center w-full py-2"
              >
                <InputBox
                  label="Wallet Address"
                  value={recipient}
                  onChange={(e) =>
                    handleArrlistChange(
                      index,
                      e.target.value,
                      "allowlistAddresses"
                    )
                  }
                />

                <div className="flex justify-between items-center">
                  {index != 0 && (
                    <TiDelete
                      className="h-6 w-6 cursor-pointer"
                      color="red"
                      onClick={() =>
                        removeArrlistInputBox(index, "allowlistAddresses")
                      }
                    />
                  )}
                </div>
              </div>
            </>
          );
        })}
        {solanaStatesError.isAllowlistError && (
          <InputErrorMsg message={solanaStatesError.allowlistErrorMessage} />
        )}
        <Button
          color="yellow"
          size="sm"
          variant="filled"
          className="flex items-center gap-3 mt-2 ml-0 mr-4 "
          onClick={() => addArrlistInputBox("allowlistAddresses")}
        >
          <BsPlus />
          Add Recipient
        </Button>

        <div className="text-center mt-2"> OR </div>

        <Button
          disabled={true}
          color="yellow"
          className="mt-2"
          size="sm"
          variant="outlined"
          fullWidth
        >
          {" "}
          Upload CSV{" "}
        </Button>
      </div>
      {/* Switch Number 4 End */}

      {/* Switch Number 5 Start */}
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> NFT Burn </h2>
          <Switch
            checked={solanaEnabled.isNftBurnable}
            onChange={() =>
              setSolanaEnabled({
                ...solanaEnabled,
                isNftBurnable: !solanaEnabled.isNftBurnable,
              })
            }
            className={`${
              solanaEnabled.isNftBurnable ? "bg-[#ffeb3b]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffeb3b] focus:ring-offset-2`}
          >
            <span
              className={`${
                solanaEnabled.isNftBurnable ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75"> Add NFT Contract Addresses </div>
      </div>
      <div className={`${!solanaEnabled.isNftBurnable && "hidden"} ml-4 mr-4 `}>
        {solanaEnabled.nftBurnableContractAddresses.map((recipient, index) => {
          return (
            <>
              <div
                key={index}
                className="flex justify-between gap-2 items-center w-full py-2"
              >
                <InputBox
                  label="Contract Address"
                  value={recipient}
                  onChange={(e) =>
                    handleArrlistChange(
                      index,
                      e.target.value,
                      "nftBurnableContractAddresses"
                    )
                  }
                />
                <div className="flex justify-between items-center">
                  {index != 0 && (
                    <TiDelete
                      className="h-6 w-6 cursor-pointer"
                      color="red"
                      onClick={() =>
                        removeArrlistInputBox(
                          index,
                          "nftBurnableContractAddresses"
                        )
                      }
                    />
                  )}
                </div>
              </div>
            </>
          );
        })}

        {solanaStatesError.isNftBurnableError && (
          <InputErrorMsg message={solanaStatesError.nftBurnableErrorMessage} />
        )}

        <Button
          color="yellow"
          size="sm"
          variant="filled"
          className="flex items-center gap-3 mt-2 ml-0 mr-4 "
          onClick={() => addArrlistInputBox("nftBurnableContractAddresses")}
        >
          <BsPlus />
          Add Recipient
        </Button>
      </div>
      {/* Switch Number 5 End */}

      {/* Switch Number 6 Start */}
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> NFT Gate </h2>
          <Switch
            checked={solanaEnabled.isNftGate}
            onChange={() =>
              setSolanaEnabled({
                ...solanaEnabled,
                isNftGate: !solanaEnabled.isNftGate,
              })
            }
            className={`${
              solanaEnabled.isNftGate ? "bg-[#ffeb3b]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffeb3b] focus:ring-offset-2`}
          >
            <span
              className={`${
                solanaEnabled.isNftGate ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Add NFT contract addresses to gate{" "}
        </div>
      </div>
      <div className={`${!solanaEnabled.isNftGate && "hidden"} ml-4 mr-4 `}>
        {solanaEnabled.nftGateContractAddresses.map((recipient, index) => {
          return (
            <>
              <div
                key={index}
                className="flex justify-between gap-2 items-center w-full py-2"
              >
                <InputBox
                  label="Contract Address"
                  value={recipient}
                  onChange={(e) =>
                    handleArrlistChange(
                      index,
                      e.target.value,
                      "nftGateContractAddresses"
                    )
                  }
                />

                <div className="flex justify-between items-center">
                  {index != 0 && (
                    <TiDelete
                      className="h-6 w-6 cursor-pointer"
                      color="red"
                      onClick={() =>
                        removeArrlistInputBox(index, "nftGateContractAddresses")
                      }
                    />
                  )}
                </div>
              </div>
            </>
          );
        })}

        {solanaStatesError.isNftGateError && (
          <InputErrorMsg message={solanaStatesError.nftGateErrorMessage} />
        )}

        <Button
          color="yellow"
          size="sm"
          variant="filled"
          className="flex items-center gap-3 mt-2 ml-0 mr-4 "
          onClick={() => addArrlistInputBox("nftGateContractAddresses")}
        >
          <BsPlus />
          Add Recipient
        </Button>
      </div>
      {/* Switch Number 6 End */}

      {/* Switch Number 7 Start */}
      <div className="mb-4 m-4">
        <div className="flex justify-between">
          <h2 className="text-lg mb-2"> Token Gate </h2>
          <Switch
            checked={solanaEnabled.isTokenGate}
            onChange={() =>
              setSolanaEnabled({
                ...solanaEnabled,
                isTokenGate: !solanaEnabled.isTokenGate,
              })
            }
            className={`${
              solanaEnabled.isTokenGate ? "bg-[#ffeb3b]" : "bg-gray-200"
            } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#ffeb3b] focus:ring-offset-2`}
          >
            <span
              className={`${
                solanaEnabled.isTokenGate ? "translate-x-6" : "translate-x-1"
              } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
            />{" "}
          </Switch>
        </div>
        <div className="w-4/5 opacity-75">
          {" "}
          Add Token contract addresses to gate{" "}
        </div>
      </div>
      <div className={`${!solanaEnabled.isTokenGate && "hidden"} ml-4 mr-4 `}>
        {solanaEnabled.tokenGateContractAddresses.map((recipient, index) => {
          return (
            <>
              <div
                key={index}
                className="flex justify-between gap-2 items-center w-full py-2"
              >
                <InputBox
                  label="Contract Address"
                  value={recipient}
                  onChange={(e) =>
                    handleArrlistChange(
                      index,
                      e.target.value,
                      "tokenGateContractAddresses"
                    )
                  }
                />
                <div className="flex justify-between items-center">
                  {index != 0 && (
                    <TiDelete
                      className="h-6 w-6 cursor-pointer"
                      color="red"
                      onClick={() =>
                        removeArrlistInputBox(
                          index,
                          "tokenGateContractAddresses"
                        )
                      }
                    />
                  )}
                </div>
              </div>
            </>
          );
        })}

        {solanaStatesError.isTokenGateError && (
          <InputErrorMsg message={solanaStatesError.tokenGateErrorMessage} />
        )}

        <Button
          color="yellow"
          size="sm"
          variant="filled"
          className="flex items-center gap-3 mt-2 ml-0 mr-4 "
          onClick={() => addArrlistInputBox("tokenGateContractAddresses")}
        >
          <BsPlus />
          Add Recipient
        </Button>
      </div>
      {/* Switch Number 7 End */}
      {getSolanaAuth ? (
        <div className="flex flex-col gap-2">
          <Button
            disabled={sharing}
            onClick={() => sharePost("solana-master")}
            color="yellow"
            className="mx-4"
          >
            {" "}
            Mint as master edition{" "}
          </Button>
        </div>
      ) : (
        <SolanaWallets title="Login with Solana" className="w-full" />
      )}
    </div>
  );
};

export default MasterEdition;
