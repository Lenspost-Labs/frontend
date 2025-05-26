import { useEnsName } from "wagmi";

export default function useEnsFromAddress(address) {
  const { data, isLoading, isError } = useEnsName({
    address,
    universalResolverAddress: "0x74E20Bd2A1fE0cdbe45b9A1d89cb7e0a45b36376",
    chainId: 1,
  });

  const ensName = data || address;

  return { ensName, isLoading, isError };
}
