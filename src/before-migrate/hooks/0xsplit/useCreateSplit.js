import { useState } from "react";
import useSplit from "./useSplit";

const useCreateSplit = () => {
  const { splitsClient } = useSplit();
  const [data, setData] = useState(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const createSplit = async (split) => {
    setIsLoading(true);
    setIsSuccess(false);
    setIsError(false);
    setError(null);
    setData(null);

    try {
      const splitData = await splitsClient.createSplit(split);
      setIsSuccess(true);
      setData(splitData);
    } catch (error) {
      setIsError(true);
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createSplit,
    data,
    isSuccess,
    isError,
    error,
    isLoading,
  };
};

export default useCreateSplit;
