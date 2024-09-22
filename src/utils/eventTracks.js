import posthog from "posthog-js";

const getChainName = (chainId) => {
  if (chainId === 1) {
    return "ethereum";
  } else if (chainId === 137) {
    return "polygon";
  } else if (chainId === 2) {
    return "solana";
  } else if (chainId === 7777777) {
    return "zora";
  } else if (chainId === 8453) {
    return "base";
  }
};

export const assetsTrack = (
  item,
  assetType,
  collectionName,
  actionType,
  isMobile
) => {
  let assetsData = {
    asset_id: Number(item?.id),
    access_platform: actionType || (isMobile && "mobile") || "web",
  };

  if (item?.type === "props" || item?.type === "background") {
    assetsData = {
      ...assetsData,
      type: item?.type === "props" ? "stickers" : (item?.type).toLowerCase(),
      author: item?.author,
      campaign: item?.campaign,
    };
  }

  if (assetType === "nft") {
    assetsData = {
      ...assetsData,
      type: assetType?.toLowerCase(),
      chain: getChainName(item?.chainId),
      contract: item?.address,
    };
  }

  if (assetType === "cc0") {
    assetsData = {
      ...assetsData,
      type: assetType?.toLowerCase(),
      collection_name: collectionName,
    };
  }

  if (assetType === "community") {
    assetsData = {
      ...assetsData,
      type: "community drop",
      ownerAddress: item?.referredFrom[0],
    };
  }

  if (assetType === "meme") {
    assetsData = {
      ...assetsData,
      type: "meme",
      name: item?.name,
    };
  }

  posthog.capture("Assets", assetsData);
};
