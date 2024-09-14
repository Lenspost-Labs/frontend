import React, { useContext } from "react";
import ERC721Edition from "../../zora-mint/components/ERC721Edition";
import { ENVIRONMENT } from "../../../../../../../services";
import { Context } from "../../../../../../../providers/context";

const FarcasterSmartPost = () => {
  const { chaindId } = useContext(Context);
  return (
    <ERC721Edition
      isOpenAction={false}
      isFarcaster={true}
      selectedChainId={chaindId}
    />
  );
};

export default FarcasterSmartPost;
