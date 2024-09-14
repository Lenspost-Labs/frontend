import { gql } from "@apollo/client";
import { utils, ethers } from "ethers";
import omitDeep from "omit-deep";
import LENS_HUB_ABI from "../../../data/json/ABI.json";
import request from "graphql-request";
import { ENVIRONMENT } from "../../env/env";

// export const LENS_HUB_CONTRACT = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d"; // mainnet
// export const LENS_HUB_CONTRACT = "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82"; // mumbai
export const LENS_HUB_CONTRACT =
  ENVIRONMENT === "production"
    ? "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d" // mainnet
    : "0x60Ae865ee4C725cd04353b5AAb364553f56ceF82"; // mumbai

export const lensHub = new ethers.Contract(
  LENS_HUB_CONTRACT,
  LENS_HUB_ABI,
  getSigner()
);

// const API_URL = "https://api-mumbai.lens.dev";
const API_URL =
  ENVIRONMENT === "production"
    ? "https://api-v2.lens.dev" // mainnet
    : "https://api-v2-mumbai-live.lens.dev"; // mumbai

export const challenge = gql`
  query Challenge($signedBy: EvmAddress!, $for: ProfileId) {
    challenge(request: { signedBy: $signedBy, for: $for }) {
      id
      text
    }
  }
`;

export const getProfileManaged = gql`
  query ProfilesManaged($for: EvmAddress!) {
    profilesManaged(request: { for: $for }) {
      items {
        id
        handle {
          fullHandle
          localName
          suggestedFormatted {
            localName
          }
        }
        metadata {
          displayName
          picture {
            ... on NftImage {
              collection {
                chainId
                address
              }
              tokenId
              image {
                raw {
                  uri
                  mimeType
                }
              }
              verified
            }
            ... on ImageSet {
              raw {
                mimeType
                uri
              }
            }
            __typename
          }
        }
      }
      pageInfo {
        next
      }
    }
  }
`;

/* helper functions */
function getSigner() {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    return signer;
  }
  return null;
}

export const signedTypeData = (domain, types, value) => {
  const signer = getSigner();
  return signer._signTypedData(
    omit(domain, "__typename"),
    omit(types, "__typename"),
    omit(value, "__typename")
  );
};

export function omit(object, name) {
  return omitDeep(object, name);
}

export const splitSignature = (signature) => {
  return utils.splitSignature(signature);
};

export const lensChallenge = async (address, profileId) => {
  const variables = { signedBy: address, for: profileId };
  let result = await request(API_URL, challenge, variables);
  return result;
};

export const getProfileData = async (address) => {
  const variables = { for: address };
  let result = await request(API_URL, getProfileManaged, variables);
  return result;
};

export const signSetDispatcherTypedData = async (typedData) => {
  const signature = await signedTypeData(
    typedData?.domain,
    typedData?.types,
    typedData?.value
  );

  return { typedData, signature };
};
