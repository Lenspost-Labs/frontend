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
import { useEffect, useState } from "react";
import { http, parseEther } from "viem";
import {
  useAccount,
  useSendTransaction,
  useWaitForTransactionReceipt,
} from "wagmi";
import { APP_ETH_ADDRESS } from "../../../../data";
import { useUser } from "../../../../hooks/user";
import { config } from "../../../../providers/EVM/EVMWalletProvider";
import { apiBuySubscription } from "../../../../services";
import Networks from "./Networks";
import coinImg from "../../../../assets/svgs/coin.svg";
const SubscriptionModal = () => {
  const { chain, address } = useAccount();
  const { points } = useUser();
  const {
    data: hash,
    error,
    isPending,
    sendTransaction,
  } = useSendTransaction({ config });

  const [openedSubscriptionModal, setOpenedSubscriptionModal] = useState(false);
  const [isChainSupported, setIsChainSupported] = useState(true);
  const handleSubscriptionModal = () => {
    setOpenedSubscriptionModal(!openedSubscriptionModal);
  };
  const [selectedSubscription, setSelectedSubscription] = useState("30");

  config.transports = {
    [chain?.id]: http(),
  };

  const supportedChains = [
    {
      name: "Base Sepolia",
      id: 84532,
    },
    {
      name: "Zora Sepolia",
      id: 999999999,
    },
    {
      name: "Optimism",
      id: 10,
    },
    {
      name: "Base - Mainnet",
      id: 8453,
    },
    {
      name: "Zora",
      id: 7777777,
    },
  ];

  const fnCheckUnsupportedChain = () => {
    supportedChains?.map((supChain) => {
      chain?.id !== supChain?.id
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
    console.log(txData);
    const buyRes = await apiBuySubscription({
      signature: txData?.transactionHash,
      chainId: chain?.id,
      evm_address: address,
    });

    console.log(buyRes);
  };
  const fnBuyPoster = async () => {
    console.log(`in switch chain chain ${chain}`);

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
    console.log(`in switch chain signature ${signature}`);
  };

  useEffect(() => {
    if (isConfirmed && hash !== undefined) {
      fnCallBuyApi();
    }
  }, [isConfirmed, hash]);

  useEffect(() => {
    fnCheckUnsupportedChain();
  }, [chain?.id]);

  return (
    <>
      {" "}
      <div
        onClick={handleSubscriptionModal}
        className="cursor-pointer flex items-center gap-2 text-lg border  font-bold p-1 my-1 rounded-md hover:bg-[#f5f5f5]"
      >
        <div className="border rounded-md text-md">
          {points}
          <img className="h-4 -mt-1" src={coinImg} alt="" />
        </div>
        <div className="text-sm">Buy xPosters</div>
      </div>
      <Dialog
        className="p-4"
        size="md"
        open={openedSubscriptionModal}
        handler={handleSubscriptionModal}
      >
        <DialogHeader className="justify-between">
          <Typography variant="h5" className=" text-gray-600 font-normal">
            Choose your $POSTER Subscription
          </Typography>
          <IconButton
            color="gray"
            size="sm"
            variant="text"
            onClick={handleSubscriptionModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody className="overflow-y-scroll">
          {/* {!isPending && ( */}
          <div className="flex flex-col mx-4 gap-2">
            <div
              onClick={() => setSelectedSubscription("30")}
              className={`cursor-pointer flex justify-between ${
                selectedSubscription === "30" ? "bg-[#f5f5f5]" : "bg-white"
              } text-lg font-bold border-2 rounded-lg p-4 py-2`}
            >
              <div className=""> 30 Poster</div>
              <div className="flex gap-2">
                <div className=""> $3</div>
                <div className=""> | 0.001 ETH</div>
              </div>
            </div>
            <div
              onClick={() => setSelectedSubscription("60")}
              className={`cursor-pointer flex justify-between ${
                selectedSubscription === "60" ? "bg-[#f5f5f5]" : "bg-white"
              } text-lg font-bold border-2 rounded-lg p-4 py-2`}
            >
              <div className=""> 60 Poster</div>
              <div className="flex gap-2">
                <div className=""> $6</div>
                <div className=""> | 0.002 ETH</div>
              </div>
            </div>
            <div
              onClick={() => setSelectedSubscription("90")}
              className={`cursor-pointer flex justify-between ${
                selectedSubscription === "90" ? "bg-[#f5f5f5]" : "bg-white"
              } text-lg font-bold border-2 rounded-lg p-4 py-2`}
            >
              <div className=""> 90 Poster</div>
              <div className="flex gap-2">
                <div className=""> $9</div>
                <div className=""> | 0.003 ETH</div>
              </div>
            </div>
          </div>
          {/* )} */}
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
              We've received your transaction, You'll get xPosters soon
            </div>
          )}
          {error && (
            <div className="m-4 text-red-500 text-xs">
              Transaction failed: {error.message}
            </div>
          )}
          {chain?.id !== 84532 && (
            <div className="m-4 text-red-500">
              Please switch to Base Sepolia to buy $POSTER
            </div>
          )}
          <div className="flex flex-col gap-2 m-4">
            <Networks
              chains={supportedChains}
              isUnsupportedChain={isChainSupported}
            />
            <Button
              disabled={isPending}
              // loading={isPending}
              onClick={fnBuyPoster}
              color="gray"
              className="w-full text-center"
            >
              Buy $POSTER
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default SubscriptionModal;
