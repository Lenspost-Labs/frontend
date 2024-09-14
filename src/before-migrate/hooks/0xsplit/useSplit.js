import { SplitsClient } from "@0xsplits/splits-sdk";
import { useChainId, usePublicClient, useWalletClient } from "wagmi";

const useSplit = () => {
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  let splitsClient;

  try {
    splitsClient = new SplitsClient({
      chainId,
      walletClient,
      publicClient,
    });
  } catch (error) {
    console.error("Error in useSplit", error);
  }

  return {
    splitsClient,
  };
};

export default useSplit;
