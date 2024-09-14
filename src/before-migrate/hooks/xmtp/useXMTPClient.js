import { Client } from "@xmtp/xmtp-js";
import { useWalletClient } from "wagmi";
import { XMTP_ENV } from "../../services";

const useXMTPClient = () => {
  const { data: walletClient } = useWalletClient();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
    const [xmtp, setXMTP] = useState(null);

  const client = async () => {
    try {
      const xmtp = await Client.create(walletClient, { env: XMTP_ENV })
      return setXMTP(xmtp);
    } catch (error) {
      setIsError(true);
      setError(error);
    }
  }

  return {
    client,
    isError,
    error,
  };
};

export default useXMTPClient;
