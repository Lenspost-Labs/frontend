import React, { createContext, useRef, useState } from "react";
import posthog from "posthog-js";

posthog.init("phc_CvXLACFkyLdhJjiGLxlix6ihbGjumRvGjUFSinPWJYD", {
  api_host: "https://eu.posthog.com",
});

export const Context = createContext();

const ContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState("");
  const contextCanvasIdRef = useRef(null);

  // for twitter auth
  const [queryParams, setQueryParams] = useState({
    oauth_token: "",
    oauth_verifier: "",
  });

  // for open different menu in share
  const [menu, setMenu] = useState("share");

  // for lens monetization
  const [enabled, setEnabled] = useState({
    chargeForCollect: false,
    chargeForCollectPrice: "1",
    chargeForCollectCurrency: "WMATIC",

    mirrorReferralReward: false,
    mirrorReferralRewardFee: 25.0,

    splitRevenueRecipients: [
      {
        recipient: "",
        split: 0.0,
      },
    ],

    limitedEdition: false,
    limitedEditionNumber: "1",

    timeLimit: false,
    endTimestamp: {
      date: "",
      time: "",
    },

    whoCanCollect: false,
  });

  const [solanaEnabled, setSolanaEnabled] = useState({
    
    // Array of List of Contract Addresses / Input Boxes
    arrOnChainSplitRecipients: [
      {
        recipient: "lenspost.xyz",
        split: 10.0,
      },
    ],
    arrAllowlist: [{ recipient: "" }],
    arrNFTBurn: [{ recipient: "" }],
    arrNFTGate: [{ recipient: "" }],
    arrTokenGate: [{ recipient: "" }],

    // Solana Mint Switch States
    chargeForMint: false,
    onChainSplits: false,
    limitNoOfEditions: false,
    scheduleMint: false,
    allowlist: false,
    nftBurn: false,
    nftGate: false,
    tokenGate: false,
  });

  const [postDescription, setPostDescription] = useState("");
  const [open, setOpen] = useState(false);

  // for calendar
  const [stFormattedDate, setStFormattedDate] = useState("");
  const [stFormattedTime, setStFormattedTime] = useState("");
  const [stCalendarClicked, setStCalendarClicked] = useState(false);

  // for preview
  const [fastPreview, setFastPreview] = useState([]);

  // for split revenue eligible address/recipient
  const referredFromRef = useRef([]);

  // NOTE: dataRefs has elementId and handle data {elementId: "elementId", handle: "handle"}

  // elementId and handle data for lens collect nft
  const lensCollectNftRecipientDataRef = useRef([]);

  // elementId and handle data for assets nft
  const assetsRecipientDataRef = useRef([]);

  // elementId and handle data for solana nfts nft
  const solanaNftRecipientDataRef = useRef([]);

  // elementId and handle data for BG remover nft
  const bgRemoverRecipientDataRef = useRef([]);

  // elementId and handle data getting from BE
  const preStoredRecipientDataRef = useRef([]);


  // The parent Array for On Chain Split recepients
  const parentOnChainSplitsRef = useRef([]);

  // The parent Array for allowlist recepients
  const parentAllowlistRef = useRef([]);

  // It has all the DataRefs data
  const parentRecipientDataRef = useRef([]);

  // solana NFT recipients list
  const solanaNftRecipientListRef = useRef([]);

  // It hass all the recipients list (kind of final recipient list but some address/)
  const parentRecipientListRef = useRef([]);


  // Right Sidebar
  const [isShareOpen, setIsShareOpen] = useState(false);

  // for lens monetization price error
  const [priceError, setPriceError] = useState({
    isError: false,
    message: "",
  });

  // for lens monetization split error
  const [splitError, setSplitError] = useState({
    isError: false,
    message: "",
  });

  // for lens monetization edition error
  const [editionError, setEditionError] = useState({
    isError: false,
    message: "",
  });

  // for lens monetization referral error
  const [referralError, setReferralError] = useState({
    isError: false,
    message: "",
  });

  // for exploere dilog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [explorerLink, setExplorerLink] = useState("");

  const handleOpen = () => setDialogOpen((cur) => !cur);

  // console.log("ContextProvider", solanaNFTCreatorRef.current);

  return (
    <Context.Provider
      value={{
        isLoading,
        setIsLoading,
        text,
        setText,
        contextCanvasIdRef,

        // for twitter auth
        queryParams,
        setQueryParams,

        // for open different menu in share
        menu,
        setMenu,

        // for lens monetization
        enabled,
        setEnabled,
        postDescription,
        setPostDescription,
        open,
        setOpen,

        // for calendar
        stFormattedDate,
        setStFormattedDate,
        stFormattedTime,
        setStFormattedTime,
        stCalendarClicked,
        setStCalendarClicked,

        // for preview
        fastPreview,
        setFastPreview,

        // Right Sidebar
        isShareOpen,
        setIsShareOpen,

        // user public templates states
        referredFromRef,

        // elementId and handle data for lens collect nft
        lensCollectNftRecipientDataRef,

        // elementId and handle data for assets nft
        assetsRecipientDataRef,

        // elementId and handle data for solana nfts nft
        solanaNftRecipientDataRef,

        // elementId and handle data for BG remover nft
        bgRemoverRecipientDataRef,

        // elementId and handle data getting from BE
        preStoredRecipientDataRef,

        // It has all the DataRefs data
        parentRecipientDataRef,

        // solana NFT recipients list
        solanaNftRecipientListRef,

        // It hass all the recipients list (kind of final recipient list but some address/)
        parentRecipientListRef,

        // for lens monetization price error
        priceError,
        setPriceError,

        // for lens monetization split error
        splitError,
        setSplitError,

        // for lens monetization edition error
        editionError,
        setEditionError,

        // for lens monetization referral error
        referralError,
        setReferralError,

        // posthog analytics
        posthog,

        // for solana mint
        solanaEnabled,
        setSolanaEnabled,

        // for explorer dilog
        dialogOpen,
        setDialogOpen,
        explorerLink,
        setExplorerLink,
        handleOpen,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export default ContextProvider;