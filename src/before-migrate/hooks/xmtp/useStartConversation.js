import useXMTPClient from "./useXMTPClient";

const useStartConversation = () => {
  const { client } = useXMTPClient();
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const xmtp = client();

  const startConversation = async (address) => {
    try {
      const conversation = await xmtp.conversations.newConversation(address);
      setIsSuccess(true);
      return conversation;
    } catch (error) {
      setIsError(true);
      setError(error);
    }
  };

  return {
    startConversation,
    isError,
    error,
    isSuccess,
  };
};

export default useStartConversation;
