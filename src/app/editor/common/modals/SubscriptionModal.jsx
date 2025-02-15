import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import BiCopy from "@meronex/icons/bi/BiCopy";
import BsBoxArrowUpRight from "@meronex/icons/bs/BsBoxArrowUpRight";
import { useContext, useEffect, useState } from "react";
import { http, parseEther } from "viem";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { APP_ETH_ADDRESS } from "../../../../data";
import { useUser } from "../../../../hooks/user";
import { wagmiAdapter } from "../../../../providers/EVM/EVMWalletProvider";
import { apiBuySubscription, ENVIRONMENT } from "../../../../services";
import Networks from "./Networks";
import coinImg from "../../../../assets/svgs/Coin.svg";
import { base, baseSepolia, optimism, zora } from "viem/chains";
import { Heart } from "lucide-react";
import FaHeartbeat from "@meronex/icons/fa/FaHeartbeat";
import AiFillHeart from "@meronex/icons/ai/AiFillHeart";
import FaRegKissWinkHeart from "@meronex/icons/fa/FaRegKissWinkHeart";
import IosHeartDislike from "@meronex/icons/ios/IosHeartDislike";
import { useAppAuth } from "../../../../hooks/app";
import { Context } from "../../../../providers/context";

const Packages = [
  {
    name: "Sweet Start",
    price: "3",
    priceETH: "0.001",
    amount: "30",
  },
  {
    name: "Love Plus",
    price: "6",
    priceETH: "0.002",
    amount: "60",
  },
  {
    name: "Ultimate Love",
    price: "9",
    priceETH: "0.003",
    amount: "90",
  },
];

const SparklingCoin = () => {
  return (
    <div className="coin">
      <div className="front jump">
        <div className="star"></div>
        <span className="currency">$</span>
        <div className="shapes">
          <div className="shape_l"></div>
          <div className="shape_r"></div>
          <span className="top">Poster</span>
          <span className="bottom">Gold</span>
        </div>
      </div>
      <div className="shadow"></div>
    </div>
  );
};

const SparklingCoins = () => {
  return (
    <div className="relative inline-block w-20 h-20">
      {/* Main coin */}
      <img
        className="h-10 w-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        src={coinImg}
        alt=""
      />

      {/* Sparkle coins */}
      <div className="absolute inset-0">
        {[...Array(6)].map((_, i) => (
          <img
            key={i}
            src={coinImg}
            alt=""
            className="absolute h-4 w-4 top-1/2 left-1/2"
            style={{
              animation: `sparkle 2s linear infinite ${i * 0.3}s`,
              left: "50%",
              top: "50%",
              transform: `rotate(${i * 60}deg) translate(25px, 0)`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

const BackgroundDecorations = () => {
  // Generate random positions for 20 decorative elements
  const decorations = [...Array(50)].map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    scale: 0.5 + Math.random() * 0.5,
    delay: Math.random() * 2,
    isHeart: Math.random() > 0.5, // randomly choose between heart and sparkle
  }));

  return (
    <div className="absolute z-[999] inset-0 overflow-hidden pointer-events-none">
      {decorations.map((dec) => (
        <div
          key={dec.id}
          className="absolute animate-float"
          style={{
            left: dec.left,
            top: dec.top,
            transform: `scale(${dec.scale})`,
            animation: `float 3s ease-in-out infinite ${dec.delay}s`,
            opacity: "0.1",
          }}
        >
          {dec.isHeart ? (
            <AiFillHeart className="w-5 h-5 text-pink-500" />
          ) : (
            <img src={coinImg} alt="" className="w-4 h-4" />
          )}
        </div>
      ))}
    </div>
  );
};

const SubscriptionModal = ({ bottomBar = false, defaultOpen = false }) => {
  const { address, chainId, chain } = useAccount();
  const { points } = useUser();
  const { isMobile } = useContext(Context);
  const {
    data: hash,
    error,
    isPending,
    sendTransaction,
  } = useSendTransaction({ wagmiAdapter });

  const [openedSubscriptionModal, setOpenedSubscriptionModal] =
    useState(defaultOpen);
  const [isChainSupported, setIsChainSupported] = useState(true);
  const handleSubscriptionModal = () => {
    setOpenedSubscriptionModal(!openedSubscriptionModal);
  };
  const [selectedSubscription, setSelectedSubscription] = useState("30");

  wagmiAdapter.transports = {
    [chainId]: http(),
  };

  const supportedChains =
    ENVIRONMENT === "production"
      ? [optimism, base, zora]
      : [base, baseSepolia, optimism, zora];
  // console.log(supportedChains);

  const fnCheckUnsupportedChain = () => {
    supportedChains?.map((supChain) => {
      chainId !== supChain?.id
        ? setIsChainSupported(false)
        : setIsChainSupported(true);
    });
  };

  const {
    data: txData,
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({
    hash,
  });

  const fnCallBuyApi = async () => {
    console.log(`Txdata `);
    // console.log(txData);
    const buyRes = await apiBuySubscription({
      signature: txData?.transactionHash,
      chainId: chainId,
      evm_address: address,
    });

    // console.log(buyRes);
  };
  const fnBuyPoster = async () => {
    // console.log(`in switch chain chain ${chain}`);

    const signature = sendTransaction({
      to: APP_ETH_ADDRESS,
      value: parseEther(
        selectedSubscription === "30"
          ? "0.001"
          : selectedSubscription === "60"
          ? "0.002"
          : "0.003"
      ),
    });
    // console.log(`in switch chain signature ${signature}`);
  };

  useEffect(() => {
    if (isConfirmed && hash !== undefined) {
      fnCallBuyApi();
    }
  }, [isConfirmed, hash]);

  useEffect(() => {
    fnCheckUnsupportedChain();
  }, [chainId]);

  return (
    <>
      {!bottomBar ? (
        <div
          onClick={handleSubscriptionModal}
          className="cursor-pointer bg-black flex items-center gap-2 text-lg border-0 font-bold px-3 py-0  my-1 group rounded-md hover:bg-[#efef97]"
        >
          <img className="h-4 w-4 -mt-1" src={coinImg} alt="" />
          <div className="text-md group-hover:text-black text-white">
            {points}
          </div>
          <div className="text-sm font-normal group-hover:text-black text-white">
            Gold
          </div>
        </div>
      ) : (
        <div
          onClick={handleSubscriptionModal}
          className={`${
            isMobile
              ? "bottom-16 absolute right-24 cursor-pointer"
              : "bottom-24 absolute right-16 cursor-pointer"
          }`}
        >
          <SparklingCoin />
        </div>
      )}
      <Dialog
        className={`p-4 relative  max-h-[90vh] ${
          isMobile ? "h-[90vh] overflow-hidden" : ""
        }`}
        size="md"
        open={openedSubscriptionModal}
        handler={handleSubscriptionModal}
      >
        <BackgroundDecorations />
        <DialogHeader className="justify-between">
          <Typography variant="h5" className="text-pink-500 font-bold">
            Choose your Poster Gold Subscription
          </Typography>
          <div className="flex items-center gap-2">
            <IosHeartDislike
              className="w-5 h-5 cursor-pointer hover:animate-pulse text-pink-500"
              onClick={handleSubscriptionModal}
            />
          </div>
        </DialogHeader>
        <DialogBody className="h-[calc(100%-4rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-pink-500 scrollbar-track-pink-50 scrollbar-thumb-rounded-full scrollbar-track-rounded-full pr-4">
          <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-pink-50 to-white">
            <h3 className="text-xl font-bold text-pink-500 mb-4">
              🔥 Unlock Poster Gold Benefits!
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span>Create AI masterpieces in HD</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span>Make backgrounds vanish instantly</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span>Save designs locally</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span>Auto-save your work</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span>Remove watermarks</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-500">✅</span>
                <span>Access exclusive token drops</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Packages.map((pkg) => (
              <div
                key={pkg.name}
                onClick={() => setSelectedSubscription(pkg.amount)}
                className={`cursor-pointer relative group transition-all duration-300 ${
                  selectedSubscription === pkg.amount
                    ? "gradient-border-active"
                    : "gradient-border"
                } p-[1px] rounded-xl`}
              >
                <div
                  className={`h-full w-full rounded-xl p-4 sm:p-6 ${
                    selectedSubscription === pkg.amount
                      ? "bg-pink-50"
                      : "bg-white hover:bg-pink-50"
                  }`}
                >
                  <div className="flex flex-col items-center text-center gap-3 sm:gap-4">
                    <div className="relative">
                      <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                        {pkg.name}
                      </h3>
                      {selectedSubscription === pkg.amount && (
                        <FaRegKissWinkHeart
                          className="absolute -right-6 sm:-right-8 -top-1 text-pink-500 animate-bounce-spin"
                          size={24}
                        />
                      )}
                    </div>
                    <div
                      className={`rounded-full px-3 py-1 font-semibold text-sm sm:text-md ${
                        selectedSubscription === pkg.amount
                          ? "bg-pink-500 text-white group-hover:bg-pink-600 group-hover:text-white"
                          : "text-pink-500 group-hover:bg-white bg-pink-50"
                      }`}
                    >
                      {pkg.amount} Gold
                    </div>
                    <div className="px-0 py-0 w-full">
                      <div
                        className={`text-lg sm:text-xl font-bold ${
                          selectedSubscription === pkg.amount
                            ? "text-pink-500"
                            : " text-gray-800"
                        }`}
                      >
                        ${pkg.price}.00 USD
                      </div>
                      <div className="text-xs sm:text-sm text-pink-500 mt-1">
                        {pkg.priceETH} ETH
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {isPending && (
            <div className="flex m-4 gap-2">
              Please confirm the Transaction in your wallet <Spinner />
            </div>
          )}
          {hash && (
            <div className="m-4 mb-0 flex gap-4 items-center cursor-pointer">
              Transaction: {hash.slice(0, 16)}...{" "}
              <BiCopy onClick={() => navigator?.clipboard?.writeText(hash)} />
              <BsBoxArrowUpRight
                onClick={() =>
                  window?.open(`https://base-sepolia.blockscout.com/tx/${hash}`)
                }
              />
            </div>
          )}

          {isConfirming && (
            <div className="m-4">Waiting for Transaction confirmation...</div>
          )}
          {isConfirmed && (
            <div className="m-4 font-medium text-green-500">
              We've received your transaction, You'll get Poster Gold soon
            </div>
          )}
          {error && (
            <div className="m-4 text-red-500 text-xs">
              Transaction failed: {error.message}
            </div>
          )}
          {/* {chain?.id !== 84532 && (
            <div className="m-4 text-red-500">
              Please switch to Base Sepolia to buy $POSTER
            </div>
          )} */}
          <div className="flex flex-col gap-3 m-4 mt-8">
            {isChainSupported && (
              <Networks
                chains={supportedChains}
                isUnsupportedChain={isChainSupported}
              />
            )}
            <Button
              disabled={isPending}
              onClick={fnBuyPoster}
              className="w-full focus:outline-none outline-none bg-pink-500 hover:bg-pink-600 text-white py-3 rounded-xl transition-colors group"
            >
              {isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4" /> Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 text-lg font-semibold">
                  Get Poster Gold{" "}
                  <FaHeartbeat className="w-5 h-5 group-hover:animate-pulse text-white" />
                </div>
              )}
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default SubscriptionModal;
