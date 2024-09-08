/**
 * Custom hook for storing Zora link in the database.
 * This hook provides a function to asynchronously store a Zora link in the database.
 * It uses a mutation from react-query to handle the mutation function mintToXchain.
 * The hook returns a function that can be used to store a Zora link, which in turn returns the slug of the stored link.
 */

import { useMutation } from "@tanstack/react-query";
import { mintToXchain } from "../../services/apis/BE-apis";
import { errorMessage } from "../../utils";

const useStoreZoraLink = () => {
  const { mutateAsync: storeZoraLinkMutation } = useMutation({
    mutationKey: "storeZoraLink",
    mutationFn: mintToXchain,
  });

  const storeZoraLink = async (paramsData) => {
    try {
      const res = await storeZoraLinkMutation(paramsData);
      console.log("StoreZoraLink", res?.slug);
      return res?.slug; // Return the slug for further use if needed
    } catch (error) {
      console.log("StoreZoraLinkErr", errorMessage(error));
      throw error; // Rethrow error for handling in the component
    }
  };

  return { storeZoraLink }; // Return the function to be used in the component
};

export default useStoreZoraLink;
