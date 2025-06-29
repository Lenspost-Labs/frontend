import axios from "axios";
import {
  BACKEND_DEV_URL,
  BACKEND_PROD_URL,
  BACKEND_LOCAL_URL,
  ENVIRONMENT,
} from "../../env/env";
import {
  getFromLocalStorage,
  saveToLocalStorage,
} from "../../../utils/localStorage";
import { LOCAL_STORAGE } from "../../../data";
import { api, API } from "./config";

/**
 * @param walletAddress string
 * @param jsonCanvasData object
 * @param params object
 * @param isPublic boolean
 * @param id number
 * @param visibility string
 * @param contractAddress string
 * @param store store object
 */

const limit = 10;

// evm auth apis start
export const evmAuth = async ({ walletAddress, signature }) => {
  const jwtToken = getFromLocalStorage(LOCAL_STORAGE.privy);

  const result = await axios.post(
    `${API}/auth/evm`,
    {
      evm_address: walletAddress,
      signature: signature,
    },
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
  );

  return result?.data;
};
// evm auth apis end

// solana auth apis start
export const solanaAuth = async ({ walletAddress, signature, message }) => {
  const result = await api.post(`${API}/auth/solana`, {
    solana_address: walletAddress,
    signature: signature,
    message: message,
  });

  return result?.data;
};
// solaana auth apis end

// lensauth apis start
// need auth token (jwt)
export const lensAuthenticate = async ({
  profileId,
  profileHandle,
  id,
  signature,
}) => {
  const result = await api.post(`${API}/auth/evm/lens`, {
    profileId: profileId,
    profileHandle: profileHandle,
    id: id,
    signature: signature,
  });

  return result?.data;
};

export const checkDispatcher = async () => {
  const result = await api.get(`${API}/util/check-dispatcher`);

  return result?.data;
};

export const getBroadcastData = async () => {
  const result = await api.get(`${API}/auth/evm/lens/set-profile-manager`);

  return result?.data;
};

export const setBroadcastOnChainTx = async (id, signature) => {
  const result = await api.post(`${API}/auth/evm/lens/broadcast-tx`, {
    id: id,
    signature: signature,
  });

  return result?.data;
};
// lensauth apis end

// twitter apis start
// need auth token (jwt)
export const twitterAuthenticate = async () => {
  try {
    // authenticated request
    const result = await api.post(`${API}/twitter/authenticate`);

    if (result?.status === 200) {
      saveToLocalStorage(
        LOCAL_STORAGE.twitterAuthURL,
        JSON.stringify(result?.data)
      );
      return {
        data: result?.data,
      };
    } else if (result?.status === 400) {
      return {
        error: result?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.error || error?.response?.data?.name,
      });
      if (error?.response?.data?.error) {
        return {
          error:
            "Twitter API access is currently restricted. Please try again later or contact support.",
        };
      }
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else if (error?.response?.status === 400) {
      console.log({ 400: error?.response?.data?.message });
      return {
        error: error?.response?.statusText,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};
// twitter apis end

// disconnect twitter apis start
export const disconnectTwitter = async () => {
  const result = await api.post(`${API}/twitter/disconnect`);
  try {
    if (result?.status === 200) {
      saveToLocalStorage(LOCAL_STORAGE.twitterAuthURL, null);
      return {
        data: result?.data,
      };
    } else if (result?.status === 400) {
      return {
        error: result?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.error || error?.response?.data?.name,
      });
      if (error?.response?.data?.error) {
        return {
          error:
            "Twitter API access is currently restricted. Please try again later or contact support.",
        };
      }
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else if (error?.response?.status === 400) {
      console.log({ 400: error?.response?.data?.message });
      return {
        error: error?.response?.statusText,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};
// disconnect twitter apis end

// twitter callback apis start
// need auth token (jwt)
export const twitterAuthenticateCallback = async (token, verifier) => {
  try {
    // authenticated request
    const result = await api.post(
      `${API}/twitter/callback?oauth_token=${token}&oauth_verifier=${verifier}`
    );

    if (result?.status === 200) {
      return {
        data: result?.data,
      };
    } else if (result?.status === 400) {
      return {
        error: result?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message || error?.response?.data?.name,
      });
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else if (error?.response?.status === 400) {
      console.log({ 400: error?.response?.data?.message });
      return {
        error: error?.response?.statusText,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};
// twitter callback apis end

export const XAuthenticated = async () => {
  try {
    const result = await api.get(`${API}/twitter/isAuthenticated`);
    if (result?.status === 200) {
      return {
        data: result?.data,
      };
    } else if (result?.status === 400) {
      return {
        error: result?.data?.message,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message || error?.response?.data?.name,
      });
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else if (error?.response?.status === 400) {
      console.log({ 400: error?.response?.data?.message });
      return {
        error: error?.response?.statusText,
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};

// NFT apis start
// upload users' nft endpoint
// need auth token (jwt)
export const refreshNFT = async () => {
  const result = await api.post(`${API}/user/nft/update`);
  return result?.data;
};

// gwt users' nft endpoint
// need auth token (jwt)
export const getNFTs = async (query, page, chainId) => {
  const result = await api.get(`${API}/user/nft?query=${query}`, {
    params: {
      page: page,
      chainId: chainId,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};

// search users' nft by id endpoint
// need auth token (jwt)
export const getNftById = async (id) => {
  const result = await api.get(`${API}/user/nft/${id}`);
  return result?.data;
};
// NFT apis end

// canvas apis satrt
// craete canvas endpoint
// need auth token (jwt)
export const createCanvas = async ({
  data,
  referredFrom,
  assetsRecipientElementData,
  preview,
}) => {
  const result = await api.post(`${API}/user/canvas/create`, {
    canvasData: {
      data: data,
      referredFrom: referredFrom,
      assetsRecipientElementData: assetsRecipientElementData,
    },
    preview: preview,
  });

  return result?.data;
};

// update current canvas endpoint
// need auth token (jwt)
export const updateCanvas = async ({
  id,
  data,
  referredFrom,
  isPublic,
  assetsRecipientElementData,
  preview,
  tags,
}) => {
  const result = await api.put(`${API}/user/canvas/update`, {
    canvasData: {
      id: id,
      data: data,
      isPublic: isPublic,
      referredFrom: referredFrom,
      assetsRecipientElementData: assetsRecipientElementData,
      tags: tags,
    },
    preview: preview,
  });

  return result?.data;
};

// change canvas visibility endpoint
// need auth token (jwt)
export const changeCanvasVisibility = async ({ id, isPublic }) => {
  const result = await api.put(`${API}/user/canvas/visibility`, {
    canvasData: {
      id: id,
      isPublic: isPublic,
    },
  });
  return result?.data;
};

// get all canvas endpoint
// need auth token (jwt)
export const getAllCanvas = async (page) => {
  const result = await api.get(`${API}/user/canvas`, {
    params: {
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};

// get canvas by id endpoint
// need auth token (jwt)
export const getCanvasById = async (id) => {
  const result = await api.get(`${API}/user/canvas/${id}`);
  return result?.data;
};

// delete canvas by id endpoint
// need auth token (jwt)
export const deleteCanvasById = async (id) => {
  const result = await api.delete(`${API}/user/canvas/delete/${id}`);
  return result?.data;
};

export const tokengateCanvasById = async ({ id, gatewith }) => {
  const result = await api.post(`${API}/user/canvas/gate/${id}`, {
    gatewith: gatewith,
  });

  return result?.data;
};

// share canvas on lens endpoint
// need auth token (jwt)
export const shareOnSocials = async ({
  canvasData,
  canvasParams,
  platform,
}) => {
  const result = await api.post(`${API}/user/canvas/publish`, {
    canvasData: canvasData,
    canvasParams: canvasParams,
    platform: platform,
  });

  return result?.data;
};

export const shareOnX = async ({ canvasData, canvasParams, platform }) => {
  const result = await api.post(`${API}/twitter/tweet`, {
    canvasData: canvasData,
    canvasParams: canvasParams,
    platform: platform,
  });

  return result?.data;
};
// canvas apis end

// collection apis start
// get all collection endpoint
// need auth token (jwt)
export const getAllCollection = async (page) => {
  const result = await api.get(`${API}/collection`, {
    params: {
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};

// get nfts of a collection endpoint
// need auth token (jwt)
export const getNftByCollection = async (contractAddress, page) => {
  const result = await api.get(`${API}/collection/${contractAddress}`, {
    params: {
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};

// search a NFT of a collection endpoint
// need auth token (jwt)
export const getCollectionNftById = async (id, contractAddress) => {
  const result = await api.get(`${API}/collection/${contractAddress}/${id}`);
  return result?.data;
};
// collection apis start

// template apis start
// no need auth token (jwt)
export const getAllTemplates = async (page) => {
  const result = await api.get(`${API}/template`, {
    params: {
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};
// template apis end

// user public templates apis start
export const getUserPublicTemplates = async (page) => {
  const result = await api.get(`${API}/template/user`, {
    params: {
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};
// user public templates apis end

// asset apis start
// need auth token (jwt)
export const getAssetByQuery = async (type, author, campaign, page) => {
  // const result = await api.get(`${API}/asset/?query=${query}`, {
  const result = await api.get(`${API}/asset`, {
    params: {
      type: type,
      author: author,
      campaign: campaign,
      page: page,
    },
  });
  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};

// Featured Backgrounds and stockers
export const getFeaturedAssets = async (type, page) => {
  const result = await api.get(`${API}/asset/featured`, {
    params: {
      type: type,
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};

// get all authors
export const getAuthors = async () => {
  const result = await api.get(`${API}/asset/all-authors`);
  return result?.data;
};

// asset apis end

// Remove Background API
export const getRemovedBgS3Link = async (query, elementId) => {
  try {
    const result = await api.post(
      `${API}/util/remove-bg?image=${encodeURIComponent(query)}&id=${elementId}`
    );

    if (result?.status === 200) {
      if (result?.data?.s3link) {
        return {
          data: {
            s3link: result?.data?.s3link,
            id: result?.data?.id,
          },
        };
      } else if (result?.data?.error) {
        return {
          error: result?.data?.error,
        };
      }
    }
  } catch (error) {
    if (error?.response?.status === 500) {
      console.log({
        InternalServerError:
          error?.response?.data?.message || error?.response?.data?.name,
      });
      return {
        error: "Internal Server Error, please try again later",
      };
    } else if (error?.response?.status === 401) {
      console.log({ 401: error?.response?.statusText });
      return {
        error: error?.response?.data?.message,
      };
    } else if (error?.response?.status === 404) {
      console.log({ 404: error?.response?.statusText });
      return {
        error: "Something went wrong, please try again later",
      };
    } else {
      return {
        error: "Something went wrong, please try again later",
      };
    }
  }
};

// user is holder of collection apis start
export const getIsUserWhitelisted = async (walletAddress) => {
  const result = await api.get(
    `${API}/util/whitelisted?wallet=${walletAddress}`
  );

  if (result?.data?.status === "success") {
    return {
      data: result?.data?.message,
    };
  }
};
// user is holder of collection apis end

// upload user assets endpoint
export const uploadUserAssets = async (image) => {
  const result = await api.post(`${API}/user/upload`, {
    image: image,
  });

  return result?.data;
};

export const uploadUserAssetToIPFS = async (image) => {
  const result = await api.post(`${API}/util/upload-image-ipfs`, {
    image: image,
  });

  return result?.data;
};

export const registerIPDerivative = async (data) => {
  const result = await api.post(`${API}/story/register-ip-derivatives`, data);

  return result?.data;
};

export const uploadAsIP = async (json) => {
  const result = await api.post(`${API}/user/upload/uploadAsIP`, json);

  return result?.data;
};

export const uploadJSONtoIPFS = async (json) => {
  const result = await api.post(`${API}/util/upload-json-ipfs`, {
    json,
  });

  return result?.data;
};

export const getIPLicenseTerms = async (data) => {
  const res = await api.get(
    `${API}/story/ip-license-terms?sp_ipid=${data.sp_ipid}&chainId=1514`
  );

  return res.data;
};

// get user assets endpoint
export const getUserAssets = async (page) => {
  const result = await api.get(`${API}/user/upload`, {
    params: {
      page: page,
    },
  });

  return {
    data: result?.data?.assets,
    nextPage: result?.data?.nextPage,
    totalPage: result?.data?.totalPage,
  };
};

// delete user assets endpoint
export const deleteUserAsset = async (id) => {
  const result = await api.delete(`${API}/user/upload/${id}`);

  return result?.data;
};

// Get Reward timeline for a user

export const getRewardTimeline = async () => {
  const result = await api.get(`${API}/user/loyalty/reward-history`);

  return {
    data: result?.data,
  };
};

// Update User Profile

export const updateUserProfile = async (data) => {
  const result = await api.post(`${API}/user/update`, data);

  return {
    data: result?.data,
  };
};

// Claim Reward

export const claimReward = async (data) => {
  const result = await api.post(`${API}/user/loyalty/claim-reward`, data);

  return {
    data: result?.data,
  };
};

export const getAIImage = async (data) => {
  const request = data;
  const result = await api.post(`${API}/ai/text-image`, request);

  return {
    data: result?.data,
  };
};

// Generate Invite code
export const apiGenerateInviteCode = async () => {
  const result = await api.post(`${API}/user/loyalty/generate-code`);

  return {
    data: result?.data,
  };
};

export const apiGenerateShareSlug = async (data) => {
  const result = await api.post(
    `${API}/user/canvas/generate-share-slug?canvasId=${data}`
  );
  return {
    data: result?.data,
  };
};

export const apiGetJSONDataForSlug = async (data) => {
  const result = await api.get(
    `${API}/user/canvas/get-shared-canvas?slug=${data}`
  );
  return {
    data: result?.data,
  };
};
export const apiGetOgImageForSlug = async (data) => {
  const result = await api.get(`${API}/util/get-slug-details?slug=${data}`);
  return {
    data: result?.data,
  };
};

export const apiBuySubscription = async (data) => {
  const result = await api.post(`${API}/mint/buy`, data);
  return {
    data: result?.data,
  };
};

export const apiGetPolotnoTexts = async () => {
  const result = await api.get(
    `https://api.polotno.com/api/get-text-templates?KEY=OpcLd8G0QzCfvasc0WkU`
  );
  return {
    data: result?.data,
  };
};

export const apiGetIPAssetsMetadata = async ({ queryKey }) => {
  const [_key, data] = queryKey;

  const result = await api.get(
    `${API}/story/ip-assets-metadata?sp_ipid=${data.sp_ipid}&sp_source=${data.sp_source}&chainId=${data.chainId}`
  );

  return {
    data: result?.data,
  };
};

export const checkTokenClaimed = async (address) => {
  const result = await api.get(`${API}/util/check-token?address=${address}`);

  return {
    data: result?.data,
  };
};
