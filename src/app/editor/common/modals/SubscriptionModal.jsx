import { useContext, useState } from "react";
import { useUser } from "../../../../hooks/user";
import { apiBuySubscription } from "../../../../services";
import {
  useAccount,
  useChains,
  useSendTransaction,
  useSwitchChain,
  useWaitForTransactionReceipt,
} from "wagmi";
import { http, parseEther } from "viem";
import { APP_ETH_ADDRESS } from "../../../../data";
import { config } from "../../../../providers/EVM/EVMWalletProvider";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Select,
  Option,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import BiCopy from "@meronex/icons/bi/BiCopy";
import Networks from "./Networks";

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

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const fnBuyPoster = () => {
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
    if (!signature) return;
    const res = apiBuySubscription({
      signature: hash,
      chainId: chain,
      evm_address: address,
    });

    console.log(res);
  };

  return (
    <>
      {" "}
      <div
        onClick={handleSubscriptionModal}
        className="cursor-pointer flex items-center gap-1 text-lg font-bold bg-[#edecec] px-2 my-1 rounded-md hover:bg-[#f5f5f5]"
      >
        {points}
        <img className="h-4 -mt-1" src="/public/svgs/coin.svg" alt="" />
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
            <div className="m-4 flex gap-4 items-center">
              Tx Hash: {hash.slice(0, 10)}...{" "}
              <BiCopy onClick={navigator?.clipboard?.writeText(hash)} />
            </div>
          )}

          {isConfirming && (
            <div className="m-4">Waiting for Transaction confirmation...</div>
          )}
          {isConfirmed && (
            <div className="m-4">You've successfully bought $POSTER</div>
          )}
          {error && (
            <div className="m-4 text-red-500 text-xs">
              Transaction failed: {error.message}
            </div>
          )}
          {chain !== 84532 && (
            <div className="m-4 text-red-500">
              Please switch to Base Sepolia to buy $POSTER
            </div>
          )}
          <div className="flex flex-col gap-2 m-4">
            {/* <Select label="Select Chain">
              {supportedChains && supportedChains.length > 0 ? (
                supportedChains.map((chain) => (
                  <Option
                    onClick={(e) => {
                      setchain(Number(chain?.id));
                    }}
                    key={chain?.id}
                    value={chain?.id?.toString()}
                  >
                    {chain?.name || "Unnamed Chain"}
                  </Option>
                ))
              ) : (
                <Option disabled>No chains available</Option>
              )}
            </Select> */}
            <h2 className="text-lg mx-2"> Switch Networks </h2>
            <Networks chains={supportedChains} />
            <Button
              disabled={isPending}
              // loading={isPending}
              onClick={fnBuyPoster}
              color="gray"
              className="w-full lg:max-w-[15rem] text-center"
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
