import { useContext, useState } from "react";
import { useAccount, useChains, useSwitchChain } from "wagmi";
import EmojiPicker, { EmojiStyle, Emoji } from "emoji-picker-react";
import { DateTimePicker } from "@atlaskit/datetime-picker";
import { chainLogo, getFromLocalStorage } from "../../../../../utils";
import { Context } from "../../../../../providers/context/ContextProvider";
import BsX from "@meronex/icons/bs/BsX";
import BsChevronDown from "@meronex/icons/bs/BsChevronDown";
import { motion, AnimatePresence } from "motion/react";
import { Button, Textarea, Typography } from "@material-tailwind/react";
import logoSolana from "../../../../../assets/logos/logoSolana.png";
import logoFarcaster from "../../../../../assets/logos/logoFarcaster.jpg";
import logoTwitter from "../../../../../assets/logos/X_logo.png";
import { InputBox } from "../../../common";
import { X_Logo } from "../../../../../assets";
import DownloadBtn from "../../top-section/download/DownloadBtn";
import { useLocalStorage } from "../../../../../hooks/app";
import { EVMWallets } from "../../top-section/auth/wallets";
import { claimReward } from "../../../../../services";
import WatermarkRemover from "./components/WatermarkRemover";
import { baseSepolia } from "viem/chains";
import { toast } from "react-toastify";
import {
  LP721SupportedChains,
  storyAeneidTestnet,
  storyMainnet,
} from "../../../../../data";
import usePrivyAuth from "../../../../../hooks/privy-auth/usePrivyAuth";

const ShareSection = () => {
  const chains = useChains();
  const {
    setMenu,
    postName,
    setPostName,
    postDescription,
    setPostDescription,
    stFormattedDate,
    setStFormattedDate,
    stFormattedTime,
    setStFormattedTime,
    stCalendarClicked,
    setStCalendarClicked,
    setZoraTab,

    isShareOpen,
    setIsShareOpen,
    setOpenBottomBar,
    setCurOpenedPanel,
    contextCanvasIdRef,
    actionType,
    isMobile,
  } = useContext(Context);
  const [stClickedEmojiIcon, setStClickedEmojiIcon] = useState("");
  const [charLimitError, setCharLimitError] = useState("");
  const [isEvmExpanded, setIsEvmExpanded] = useState(false);
  const { evmAuth } = useLocalStorage();
  const { login } = usePrivyAuth();

  const {
    error: errorSwitchNetwork,
    isError: isErrorSwitchNetwork,
    isLoading: isLoadingSwitchNetwork,
    isSuccess: isSuccessSwitchNetwork,
    switchChain,
  } = useSwitchChain();

  const excludedChains = [storyAeneidTestnet?.id, storyMainnet?.id];

  const filteredChains = chains.filter(
    (chain) => !excludedChains.includes(chain?.id)
  );

  // Calendar Functions:
  const onCalChange = (value, dateString) => {
    const dateTime = new Date(value);

    // Format the date
    const dateOptions = { year: "numeric", month: "long", day: "numeric" };
    setStFormattedDate(dateTime.toLocaleDateString(undefined, dateOptions));

    // Format the time
    const timeOptions = {
      hour: "numeric",
      minute: "numeric",
      timeZoneName: "short",
    };
    setStFormattedTime(dateTime.toLocaleTimeString(undefined, timeOptions));
  };

  // Function to handle emoji click
  // Callback sends (data, event) - Currently using data only
  function fnEmojiClick(emojiData) {
    setPostDescription(postDescription + emojiData?.emoji); //Add emoji to description
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const maxByteLimit = 195;
    const byteLength = new TextEncoder().encode(value).length;

    if (name === "title") {
      setPostName(value);
      if (isMobile) {
        setPostName("Default Title");
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

  const setState = () => {
    setMenu("ERC1155");
    setZoraTab("ERC1155");
  };

  const setCurrentMenu = (menu) => {
    console.log("setCurrentMenu", menu);
    setMenu(menu);
    // if (contextCanvasIdRef?.current) {
    // 	setMenu(menu)
    // } else {
    // 	toast.error('Please create a frame first')
    // }
  };

  const setChainTab = (chainId) => {
    setMenu(chainId);
  };

  return (
    <>
      <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-md rounded-lg  rounded-r-none ">
        <div className="">
          {/* <Dialog.Title className="w-full text-white text-xl leading-6 p-6 fixed bg-gray-900 z-10">
          Share this Design
        </Dialog.Title> */}

          {/* Don't add - `fixed` solved major Bug */}
          {!isMobile && (
            <div className="flex flex-row justify-between top-0 w-full text-white text-xl leading-6 p-4 bg-gray-900 rounded-lg rounded-r-none ">
              {/* For alignment */}
              <div className=""> {""} </div>
              <div className="">Share this Design</div>
              <div
                className="z-100 cursor-pointer"
                onClick={() => {
                  setIsShareOpen(!isShareOpen);
                  setOpenBottomBar(false);
                }}
              >
                <BsX size="24" />
              </div>
            </div>
          )}
        </div>

        {/* Calender For Schedule - 18Jun2023 */}
        <div className={`${!stCalendarClicked && "hidden"}`}>
          <div
            className={`
          ml-6 mr-6 mb-4`}
          >
            <div className="m-1">Make it Collectible</div>
            <DateTimePicker className="m-4" onChange={onCalChange} />
          </div>

          <div className={`flex flex-col m-2 ml-8`}>
            <div className="mt-1 mb-3">Schedule</div>
            <div className="flex flex-row border-l-8 border-l-[#e1f16b] p-4 rounded-md">
              <div className="flex flex-col">
                <div className="text-4xl text-[#E699D9]">
                  {stFormattedDate.slice(0, 2)}
                </div>
                <div className="text-lg text-[#2D346C]">
                  {stFormattedDate.slice(2)}
                </div>
              </div>

              <div className="flex flex-col ml-4">
                <div className="ml-2 mt-10">{stFormattedTime}</div>
              </div>
            </div>
          </div>
        </div>
        {/* 
        <Button className="mx-6" onClick={fnCallRemoveWatermark}>
          Remove Watermark
        </Button> */}
        {/* Share - Icons - 18Jun2023 */}
        {isMobile &&
          (!evmAuth && actionType !== "composer" && actionType !== "framev2" ? (
            <EVMWallets
              title={"Connect Wallet"}
              className="mx-2"
              login={login}
            />
          ) : (
            <div className="flex flex-col mt-4 gap-2">
              <Button
                className="mx-6"
                onClick={() => {
                  setCurrentMenu("farcasterShare");
                  setOpenBottomBar(false);
                }}
              >
                Cast as Image
              </Button>

              {actionType !== "composer" && actionType !== "framev2" && (
                <Button
                  className="mx-6"
                  onClick={() => {
                    setCurrentMenu("xshare");
                    setOpenBottomBar(false);
                  }}
                >
                  Share on X
                </Button>
              )}

              <div className={`relative mt-6 px-4 sm:px-6`}>
                <div
                  className="flex items-center justify-between cursor-pointer py-3 px-4 bg-gray-900 text-white hover:bg-gray-800 border border-gray-200 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md mx-[6px]"
                  onClick={() => setIsEvmExpanded(!isEvmExpanded)}
                >
                  <p className="text-lg font-medium">Make it Collectible</p>
                  <motion.div
                    animate={{ rotate: isEvmExpanded ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm"
                  >
                    <BsChevronDown size={16} className="text-gray-600" />
                  </motion.div>
                </div>
                <AnimatePresence>
                  {isEvmExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-3 gap-x-10 gap-y-6 my-3">
                        {filteredChains.map((item) => {
                          return (
                            <div
                              key={item?.id}
                              className="cursor-pointer flex flex-col items-center gap-2"
                              onClick={() => {
                                setChainTab(item?.id);
                              }}
                            >
                              {" "}
                              <img
                                className="w-10 h-10"
                                src={chainLogo(item?.id)}
                                alt={`${item?.name} blockchain logo`}
                              />{" "}
                              <Typography className="text-md font-semibold text-center">
                                {item?.name}
                              </Typography>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ))}
        {!isMobile && (
          <>
            <hr />
            <div className={`relative mt-6 px-4 sm:px-6`}>
              <p className="text-lg">Share on socials</p>
              <div className="flex ">
                <>
                  <div className="flex items-center space-x-12 py-5">
                    <div onClick={() => setCurrentMenu("farcasterShare")}>
                      {" "}
                      <img
                        className="w-10 cursor-pointer rounded-md"
                        src={logoFarcaster}
                        alt="Farcaster"
                      />{" "}
                    </div>
                  </div>
                  <div
                    className={`flex items-center py-5 space-x-12 ${
                      !isMobile ? "ml-8" : " "
                    }`}
                  >
                    <div onClick={() => setCurrentMenu("xshare")}>
                      {" "}
                      <img
                        className="w-10 cursor-pointer rounded-md"
                        src={logoTwitter}
                        alt="X"
                      />{" "}
                    </div>
                  </div>
                  {/* <div
                    className={`flex items-center py-5 space-x-12 ${
                      !isMobile ? "ml-8" : " "
                    }`}
                  >
                    <div onClick={() => setCurrentMenu("lensmonetization")}>
                      {" "}
                      <img
                        className="w-10 cursor-pointer"
                        src="/other-icons/share-section/iconLens.png"
                        alt="Lens"
                      />{" "}
                    </div>
                  </div> */}
                </>
              </div>
            </div>
            <hr />

            <div className={`relative mt-6 px-4 sm:px-6`}>
              <p className="text-lg">Register IP on Story Protocol</p>
              <div className="flex flex-wrap items-center gap-10 my-3">
                <div
                  className="cursor-pointer flex flex-col items-center"
                  onClick={() => setCurrentMenu("storyMint")}
                >
                  <img
                    className="w-10 h-10"
                    src={chainLogo(1155)}
                    alt="Story Protocol"
                  />{" "}
                  <Typography className="text-md font-semibold">
                    Story Protocol
                  </Typography>
                </div>
              </div>
            </div>
            <hr />
            <div className={`relative mt-6 px-4 sm:px-6`}>
              <div
                className="flex items-center justify-between cursor-pointer py-3 px-4 bg-gray-900 text-white hover:bg-gray-800 border border-gray-200 rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md mb-4 mx-1"
                onClick={() => setIsEvmExpanded(!isEvmExpanded)}
              >
                <p className="text-lg font-medium">Make it Collectible</p>
                <motion.div
                  animate={{ rotate: isEvmExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-sm"
                >
                  <BsChevronDown size={16} className="text-gray-600" />
                </motion.div>
              </div>
              <AnimatePresence>
                {isEvmExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-3 gap-x-10 gap-y-6 my-3">
                      {filteredChains.map((item) => {
                        return (
                          <div
                            key={item?.id}
                            className="cursor-pointer flex flex-col items-center gap-2"
                            onClick={() => {
                              setChainTab(item?.id);
                            }}
                          >
                            {" "}
                            <img
                              className="w-10 h-10"
                              src={chainLogo(item?.id)}
                              alt={`${item?.name} blockchain logo`}
                            />{" "}
                            <Typography className="text-md font-semibold text-center">
                              {item?.name}
                            </Typography>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <hr />

            {/* <div className={`relative mt-6 px-4 sm:px-6`}>
              <p className="text-lg">Mint as an NFT on Solana</p>
              <div className="flex flex-wrap items-center gap-10 my-3">
                <div
                  className="cursor-pointer flex flex-col items-center"
                  onClick={() => setCurrentMenu("solanaMint")}
                >
                  {" "}
                  <img className="w-10" src={logoSolana} alt="Solana" />{" "}
                  <Typography className="text-md font-semibold">
                    Solana
                  </Typography>
                </div>
              </div>
            </div> */}
            <hr />
          </>
        )}
        {isMobile && <hr className="my-6" />}
        <div className={`${isMobile ? "mt-0" : "mt-4"}`}></div>
        <WatermarkRemover />
      </div>
    </>
  );
};

export default ShareSection;
