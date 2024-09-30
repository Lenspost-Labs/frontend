import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../../../../../providers/context";
import {
  Button,
  Card,
  List,
  ListItem,
  Spinner,
  Typography,
} from "@material-tailwind/react";

import { useEstimateFeesPerGas, useAccount, useSwitchChain } from "wagmi";
import { base, baseSepolia, confluxESpace } from "wagmi/chains";
import { useSendTransaction, useWaitForTransactionReceipt } from "wagmi";
import { http, parseEther } from "viem";
import { toast } from "react-toastify";
import { config } from "../../../../../../../providers/EVM/EVMWalletProvider";
import { ENVIRONMENT } from "../../../../../../../services";
import { usePrivy } from "@privy-io/react-auth";

const Topup = ({ topUpAccount, refetchWallet, balance, sponsored }) => {
  const { farcasterStates, setFarcasterStates, chainId } = useContext(Context);
  const [extraPayForMints, setExtraPayForMints] = useState(null);
  const { chain } = useAccount();
  const { authenticated, login } = usePrivy();
  const {
    data: switchData,
    isLoading: switchLoading,
    isError: switchError,
    error: switchErrorData,
    switchChain,
  } = useSwitchChain();

  const {
    data: feeData,
    isError: isFeeError,
    error: feeError,
    isLoading: isFeeLoading,
  } = useEstimateFeesPerGas({
    chainId: chain?.id,
    formatUnits: "ether",
  });

  const allowedMints = Number(farcasterStates.frameData?.allowedMints);
  const isSufficientBalance = farcasterStates.frameData?.isSufficientBalance;
  const isTopup = farcasterStates.frameData?.isTopup;
  const selectedNetwork = farcasterStates?.frameData?.selectedNetwork;
  const isCustomCurrMint = farcasterStates?.frameData?.isCustomCurrMint;
  const TxFeeForDeployment = 0.00009;
  const txFeeForMint = isCustomCurrMint ? 0.00003 : 0.00005;
  const isCreatorSponsored = farcasterStates.frameData.isCreatorSponsored;

  //   bcoz first 10 is free so we are subtracting 10 from total mints
  const numberOfExtraMints = allowedMints - sponsored;

  const payForMintsForCustomCurr = Number(TxFeeForDeployment)
    .toFixed(18)
    .toString();
  const payForMintsForSponsored = Number(
    txFeeForMint * numberOfExtraMints + TxFeeForDeployment
  )
    .toFixed(18)
    .toString();

  config.transports = {
    [chain?.id]: http(),
  };
  const payForMints = isCustomCurrMint
    ? payForMintsForCustomCurr
    : payForMintsForSponsored;

  const { data, isPending, isSuccess, isError, error, sendTransaction } =
    useSendTransaction({ config });

  const {
    data: txData,
    isError: isTxError,
    error: txError,
    isLoading: isTxLoading,
    isSuccess: isTxSuccess,
  } = useWaitForTransactionReceipt({
    hash: data,
  });

  const handleChange = (e, key) => {
    const { name, value } = e.target;

    setFarcasterStates((prevState) => {
      // Create a new state based on the previous state
      const newState = {
        ...prevState,
        frameData: {
          ...prevState.frameData,
          [key]: value,
        },
      };
      return newState;
    });
  };

  // change the frameData isTopup to true if transaction is success
  useEffect(() => {
    if (isTxSuccess) {
      setFarcasterStates({
        ...farcasterStates,
        frameData: {
          ...farcasterStates.frameData,
          isTopup: true,
        },
      });

      setTimeout(() => {
        refetchWallet();
      }, 2000);
    }
  }, [isTxSuccess]);

  // check if the user has enough balance to pay for mints
  useEffect(() => {
    setFarcasterStates((prevState) => {
      const newState = { ...prevState };

      if (balance >= payForMints) {
        // balance is sufficient
        newState.frameData.isSufficientBalance = true;
      } else {
        // balance is not sufficient

        if (payForMints - balance > 0) {
          setExtraPayForMints((payForMints - balance).toFixed(18).toString());
          newState.frameData.isSufficientBalance = false;
        } else {
          newState.frameData.isSufficientBalance = true;
        }
      }

      return newState;
    });
  }, [farcasterStates.frameData.allowedMints, balance, isTopup]);

  // get the error message
  useEffect(() => {
    if (isError) {
      console.log(error);
      toast.error(error?.message.split("\n")[0]);
    } else if (isTxError) {
      console.log(txError);
      toast.error(txError?.message.split("\n")[0]);
    }
  }, [isError, isTxError]);

  // if (farcasterStates.frameData.isCreatorSponsored && chain?.id !== chainId) {
  //   return (
  //     <Card className="my-2">
  //       <List>
  //         <ListItem
  //           className="flex justify-between items-center gap-2"
  //           onClick={() => {
  //             !authenticated
  //               ? login()
  //               : switchChain({
  //                   chainId: chainId,
  //                 });
  //           }}
  //         >
  //           <Typography variant="h6" color="blue-gray">
  //             {!authenticated
  //               ? "Please connect your wallet for topup"
  //               : `Click here to switch to
  //             ${ENVIRONMENT === "production" ? "Base" : "BaseSepolia"} chain for
  //             Topup`}
  //           </Typography>
  //         </ListItem>
  //       </List>
  //     </Card>
  //   );
  // }

  if (
    farcasterStates.frameData.isCustomCurrMint &&
    chain?.id !== selectedNetwork?.id
  ) {
    return (
      <Card className="my-2">
        <List>
          <ListItem
            className="flex justify-between items-center gap-2"
            onClick={() =>
              switchChain({
                chainId: network?.id,
              })
            }
          >
            <Typography variant="h6" color="blue-gray">
              Click here to switch to {selectedNetwork?.name}
            </Typography>
          </ListItem>
        </List>
      </Card>
    );
  }

  if (isFeeLoading) {
    return (
      <Card className="my-2">
        <List>
          <ListItem className="flex justify-between items-center gap-2">
            <Spinner color="green" />
          </ListItem>
        </List>
      </Card>
    );
  }

  if (isFeeError) {
    return (
      <Card className="my-2">
        <List>
          <ListItem className="flex justify-between items-center gap-2">
            <Typography variant="h6" color="blue-gray">
              Error fetching gas price
            </Typography>
          </ListItem>
        </List>
      </Card>
    );
  }

  return (
    <Card className="my-2">
      <List>
        <ListItem className="flex-col items-end gap-2">
          {isSufficientBalance ? (
            <Typography variant="h6" color="green">
              Sufficient balance to sponsor the gas
            </Typography>
          ) : !authenticated ? (
            <>
              <Typography variant="h6" color="blue-gray">
                Please connect your wallet to topup
              </Typography>
              <Button onClick={login}>Connect</Button>
            </>
          ) : isCreatorSponsored && chain?.id !== chainId ? (
            <>
              <Typography variant="h6" color="blue-gray">
                Switch chain to{" "}
                {ENVIRONMENT === "production" ? "Base" : "BaseSepolia"} for
                Topup
              </Typography>
              <Button
                onClick={() =>
                  switchChain({
                    chainId: chainId,
                  })
                }
              >
                Switch chain
              </Button>
            </>
          ) : (
            <>
              <Typography variant="h6" color="red">
                Insufficient balance please topup
              </Typography>

              <Typography variant="h6" color="blue-gray">
                {extraPayForMints ? extraPayForMints : payForMints}{" "}
                <>
                  {chain?.name} {chain?.nativeCurrency?.symbol}
                </>
              </Typography>

              <div className="w-full flex justify-between items-center">
                {isTxLoading || isPending ? (
                  <div className="flex justify-start gap-2">
                    <Typography variant="h6" color="blue-gray">
                      {isPending
                        ? "Confirm transaction"
                        : isTxLoading
                        ? "Confirming"
                        : ""}
                    </Typography>
                    <Spinner color="green" />
                  </div>
                ) : (
                  <div></div>
                )}

                {isTxSuccess ? (
                  <Button color="green" size="sm" className="flex justify-end">
                    Paid
                  </Button>
                ) : (
                  <Button
                    onClick={() =>
                      sendTransaction({
                        to: topUpAccount,
                        chainId: chain?.id,
                        value: extraPayForMints
                          ? parseEther(extraPayForMints)
                          : parseEther(payForMints),
                      })
                    }
                    color="green"
                    size="sm"
                    className="flex justify-end"
                  >
                    Pay
                  </Button>
                )}
              </div>
            </>
          )}
        </ListItem>
      </List>
    </Card>
  );
};

export default Topup;
