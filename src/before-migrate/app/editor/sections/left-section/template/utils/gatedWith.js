import { isEthAddress } from "../../../../../../utils";

export const gatedWith = (modal) => {
  if (modal?.gatedWith?.length > 0) {
    let arr = [];

    for (let i = 0; i < modal.gatedWith.length; i++) {
      // check if it a erthereum address
      const isAddress = isEthAddress(modal.gatedWith[i]);
      if (isAddress) {
        const link = `https://opensea.io/assets/ethereum/${modal.gatedWith[i]}`;
        arr.push(link);
      } else {
        const link = `https://lenster.xyz/posts/${modal.gatedWith[i]}`;
        arr.push(link);
      }
    }

    return arr;
  }
};
