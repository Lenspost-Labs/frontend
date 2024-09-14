import React from "react";
import ERC721Edition from "../../zora-mint/components/ERC721Edition";
import { ENVIRONMENT } from "../../../../../../../services";

const SmartPost = () => {
  const chaindId = ENVIRONMENT === "production" ? 8453 : 5;
  return <ERC721Edition isOpenAction={true} selectedChainId={chaindId} />;
};

export default SmartPost;
