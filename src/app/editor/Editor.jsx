import React, { useContext, useEffect, useRef, useState } from "react";
import { PolotnoContainer, SidePanelWrap, WorkspaceWrap } from "polotno";
import { Toolbar } from "polotno/toolbar/toolbar";
import { ZoomButtons } from "polotno/toolbar/zoom-buttons";
import {
  AIImageSection,
  BannerSection,
  DesignSection,
  NFTSection,
  ResizeSection,
  ShapeSection,
  StickerSection,
  TemplateSection,
  UploadSection,
  MemeSection,
} from "./sections/left-section";
import { BgRemover } from "./sections/bottom-section";
import { OnboardingSteps, OnboardingStepsWithShare } from "./common";
import { SpeedDialX } from "./common/elements/SpeedDial";
import { Tooltip } from "polotno/canvas/tooltip";
import { useSolanaWallet } from "../../hooks/solana";
import {
  APP_ETH_ADDRESS,
  LOCAL_STORAGE,
  STORY_BASE_URL,
  STORY_KNOWN_APP_IDS,
} from "../../data";
import { Button } from "@material-tailwind/react";
import { useAppAuth, useLocalStorage } from "../../hooks/app";
import { getFarUserDetails, redeemCode } from "../../services/apis/BE-apis";
import { useLocation, useNavigate } from "react-router-dom";
import { watermarkBase64 } from "../../assets/base64/watermark";
import { PagesTimeline } from "polotno/pages-timeline";
import { toast } from "react-toastify";
import { addGlobalFont, unstable_setAnimationsEnabled } from "polotno/config";
import {
  BackgroundSection,
  LayersSection,
  TextSection,
  SidePanel,
} from "polotno/side-panel";
import { useStore } from "../../hooks/polotno";
import { useAccount } from "wagmi";
import { useTour } from "@reactour/tour";
import { Context } from "../../providers/context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  checkDispatcher,
  createCanvas,
  updateCanvas,
  apiGetOgImageForSlug,
  apiGetJSONDataForSlug,
  apiGetIPAssetsMetadata,
} from "../../services";
import { Workspace } from "polotno/canvas/workspace";
import {
  errorMessage,
  loadFile,
  base64Stripper,
  wait,
  getFromLocalStorage,
  saveToLocalStorage,
  consoleLogonlyDev,
  waterMark,
  randomId,
} from "../../utils";
import FcIdea from "@meronex/icons/fc/FcIdea";
import { TopbarSection } from "./sections/top-section";

import MobileTopbar from "./sections/top-section/MobileTopBar/MobileTopbar";
import MobileBottombar from "./sections/bottom-section/bottomBar/MobileBottombar";
import OnboardingModal from "./common/modals/OnboardingModal";
import HiOutlineSparkles from "@meronex/icons/hi/HiOutlineSparkles";
import useMobilePanelFunctions from "./common/mobileHooks/useMobilePanelFunctions";
import SignMesasgeModal from "./common/modals/SignMesasgeModal";
import SubscriptionModal from "./common/modals/SubscriptionModal";

import usePrivyAuth from "../../hooks/privy-auth/usePrivyAuth";

// enable animations
unstable_setAnimationsEnabled(true);

const sections = [
  AIImageSection,
  StickerSection,
  TemplateSection,
  MemeSection,
  DesignSection,
  UploadSection,
  BackgroundSection,
  TextSection,
  ShapeSection,
  BannerSection,
  NFTSection,
  LayersSection,
  ResizeSection,
];

const useHeight = () => {
  const [height, setHeight] = React.useState(window.innerHeight);
  React.useEffect(() => {
    window.addEventListener("resize", () => {
      setHeight(window.innerHeight);
    });
  }, []);
  return height;
};

const Editor = () => {
  const store = useStore();
  const height = useHeight();
  const { address, isConnected } = useAccount();
  const { solanaAddress } = useSolanaWallet();
  const { isAuthenticated } = useAppAuth();
  const canvasIdRef = useRef(null);
  const timeoutRef = useRef(null);
  const isPageActive = useRef(false);
  const isWatermark = useRef(false);
  const { setSteps, setIsOpen, setCurrentStep } = useTour();

  const {
    contextCanvasIdRef,
    setEnabled,
    setFastPreview,
    referredFromRef,
    lensCollectNftRecipientDataRef,
    assetsRecipientDataRef,
    assetsIdListRef,
    nftRecipientDataRef,
    bgRemoverRecipientDataRef,
    preStoredRecipientDataRef,
    parentRecipientDataRef,
    parentRecipientListRef,
    canvasBase64Ref,
    farcasterStates,
    setFarcasterStates,
    setPostName,
    storyIPDataRef,
    chainId,

    // Mobile UI
    isMobile,
    setIsMobile,
    removedWMarkCanvas,
    setRemovedWMarkCanvas,
    openLeftBar,
    setCurOpenedPanel,
    setOpenBottomBar,
    isOpenBottomBar,
    setCurOpenedTabLevel1,
    isLoggedOut,

    setIsOnboardingOpen,
    isOnboardingOpen,
  } = useContext(Context);

  const { fnOpenPanel } = useMobilePanelFunctions();

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const componentMounted = useRef(false);
  // initialize watermark
  // useEffect(() => {
  //   waterMark(store);
  // }, [store]);

  // Slug implementation - Imports : // ?slug=test-slug-id
  const navigate = useNavigate();
  const location = useLocation(); //To get the URL location
  const queryParams = new URLSearchParams(location.search); //to Check A URL search string, beginning with a ?slugId
  const inviteCode = queryParams.get("inviteCode");
  const actionType = queryParams.get("actionType");
  // console.log("inviteCode", inviteCode);

  const handleDrop = (ev) => {
    // Do not load the upload dropzone content directly to canvas
    // Avoids Duplication issue
    if (store.openedSidePanel == "Upload") {
      return;
    }
    console.log(store.openedSidePanel);
    // Prevent default behavior (Prevent file from being opened)
    ev.preventDefault();

    // skip the case if we dropped DOM element from side panel
    // in that case Safari will have more data in "items"
    if (ev.dataTransfer.files.length !== ev.dataTransfer.items.length) {
      return;
    }
    // Use DataTransfer interface to access the file(s)
    for (let i = 0; i < ev.dataTransfer.files.length; i++) {
      loadFile(ev.dataTransfer.files[i], store);
    }
  };
  // ------ ai_integration branch

  const queryClient = useQueryClient();

  // create canvas mutation
  const { mutateAsync: createCanvasAsync } = useMutation({
    mutationKey: "createCanvas",
    mutationFn: createCanvas,
    // onSuccess: () => {
    //   queryClient.invalidateQueries(["my-designs"], { exact: true });
    // },
  });

  // update canvas mutation
  const { mutateAsync: updateCanvasAsync } = useMutation({
    mutationKey: "createCanvas",
    mutationFn: updateCanvas,
    // onSuccess: () => {
    //   queryClient.invalidateQueries(["my-designs"], { exact: true });
    // },
  });
  // 03June2023

  useEffect(() => {
    const checks = async () => {
      try {
        const [farUserDetails, dispatcherStatus] = await Promise.all([
          getFarUserDetails(),
          checkDispatcher(),
        ]);

        saveToLocalStorage(
          LOCAL_STORAGE.farcasterAuth,
          farUserDetails?.message
        );

        saveToLocalStorage(
          LOCAL_STORAGE.dispatcher,
          dispatcherStatus?.status === "success"
            ? dispatcherStatus?.message
            : false
        );
      } catch (error) {
        console.error("Error performing checks:", error);
      }
    };

    if (isAuthenticated) {
      checks();
    }
  }, [isAuthenticated]);

  // From Slug data
  let arrSlugAssetRecipients = [];
  let arrSlugReferredFrom = [];

  // Function to load the data on the canvas
  const fnLoadDataOnCanvas = async () => {
    const dataForSlug = await apiGetJSONDataForSlug(slugId);
    consoleLogonlyDev("dataForSlug", dataForSlug?.data);

    // Load the data on Canvas
    store.loadJSON(dataForSlug?.data?.data);

    // Load the recipients
    arrSlugAssetRecipients = dataForSlug?.data?.assetsRecipientElementData;
    arrSlugReferredFrom = dataForSlug?.data?.referredFrom;

    // Update the meta tag in case there is any change in the image
    const ogImageLink = dataForSlug?.data?.image;
    let metaTag = document.querySelector('meta[property="og:image"]');
    if (!metaTag) {
      // If the meta tag doesn't exist, create it
      metaTag = document.createElement("meta");
      metaTag.setAttribute("property", "og:image");
      document.getElementsByTagName("head")[0].appendChild(metaTag);
    }
    // Set or update the content of the meta tag
    metaTag.setAttribute("content", ogImageLink);
  };

  // function to filter the recipient data
  const recipientDataFilter = () => {
    // From Slug data
    preStoredRecipientDataRef.current = arrSlugAssetRecipients;
    parentRecipientDataRef.current = [
      ...preStoredRecipientDataRef.current, // recipient data geting from BE
      ...lensCollectNftRecipientDataRef.current, // recipient data of lens collect
      ...assetsRecipientDataRef.current, // recipient data of assets
      ...nftRecipientDataRef.current, // recipient data of solana
      ...bgRemoverRecipientDataRef.current, // recipient data of bg remover
      ...storyIPDataRef.current, // recipient data of story nft
    ];

    const recipientDataRefArr = parentRecipientDataRef.current;

    // array of indexes for the elements that are not found
    const notFoundIndexes = [];

    // iterate through recipientDataRefArr and check if each element's id exists in the store by using store.getElementById(item.id).
    for (let i = 0; i < recipientDataRefArr.length; i++) {
      const item = recipientDataRefArr[i];
      const foundElement = store.getElementById(item.elementId);

      if (!foundElement) {
        notFoundIndexes.push(i);
      }
    }

    // Generate a new array by removing elements at notFoundIndexes
    const newDataRef = recipientDataRefArr.filter(
      (_, index) => !notFoundIndexes.includes(index)
    );

    // update the parentRecipientDataRef with the new array
    parentRecipientDataRef.current = newDataRef;

    // get the handles and address from the newArray
    const newArrayRecipients = newDataRef.map(
      (item) => item.recipient || item?.handle
    );

    return {
      recipientsData: parentRecipientDataRef.current,
      recipients: newArrayRecipients,
    };
  };

  // function to add the all recipient handles / address
  const recipientDataCombiner = () => {
    // on refresh of the page, it's getting null
    const { userAddress } = useLocalStorage();

    // From Slug data
    referredFromRef.current = arrSlugReferredFrom || [];
    // Get unique recipients by creating a Set
    const recipientsSet = new Set([
      ...(referredFromRef.current.length > 0 &&
      referredFromRef.current[0] !== APP_ETH_ADDRESS
        ? [referredFromRef.current[0]]
        : []), // Add owner address if canvas is owned by other user and not equal to APP_ETH_ADDRESS
      ...recipientDataFilter().recipients, // Add handles of all the dataRefs recipients
    ]);

    // Remove userAddress if it's equal to APP_ETH_ADDRESS
    if (userAddress !== APP_ETH_ADDRESS) {
      recipientsSet.add(userAddress); // Add userAddress if it's not equal to APP_ETH_ADDRESS
    }

    // Convert the Set back to an array
    const parentRecipientList = Array.from(recipientsSet);

    parentRecipientListRef.current = parentRecipientList;

    return {
      recipients: parentRecipientListRef.current,
    };
  };

  // store the canvas and update it by traching the changes
  const requestSave = () => {
    // if save is already requested - do nothing
    if (timeoutRef.current) {
      return;
    }

    // schedule saving to the backend
    timeoutRef.current = setTimeout(async () => {
      // reset timeout
      timeoutRef.current = null;

      // export the design
      const json = store.toJSON();

      const canvasChildren = json.pages[0]?.children;
      if (contextCanvasIdRef.current) {
        canvasIdRef.current = contextCanvasIdRef.current;
      }

      if (canvasChildren?.length === 0) {
        console.log("Canvas is empty. Its stopped saving");
        canvasIdRef.current = null;
        contextCanvasIdRef.current = null;
        isPageActive.current = false;
        storyIPDataRef.current = null;
      }

      // save it to the backend
      if (canvasChildren?.length > 0) {
        isPageActive.current = true;
        // console.log('parentRecipientObj', recipientDataFilter().recipientsData)
        // console.log('parentRecipientRef', recipientDataCombiner().recipients)

        // return;

        // create new canvas
        if (!canvasIdRef.current) {
          const reqbody = {
            data: json,
            referredFrom: recipientDataCombiner().recipients,
            assetsRecipientElementData: recipientDataFilter().recipientsData,
            preview: canvasBase64Ref.current,
            assetIds:
              [
                ...new Set(
                  assetsIdListRef.current
                    .map((item) => item?.assetId)
                    .filter((id) => id !== undefined)
                ),
              ] || [],
            parentIpIds:
              [
                ...new Set(
                  storyIPDataRef.current
                    .map((item) => item?.ipID)
                    .filter((id) => id !== undefined)
                ),
              ] || [],
            licenseTermsIds:
              [
                ...new Set(
                  storyIPDataRef.current
                    .map((item) => item?.licenseTermsId)
                    .filter((id) => id !== undefined)
                ),
              ] || [],
          };
          createCanvasAsync(reqbody)
            .then((res) => {
              if (res?.status === "success") {
                canvasIdRef.current = res?.id;
                contextCanvasIdRef.current = res?.id;
                console.log(res?.message);
              }
            })
            .catch((err) => {
              console.log("Canvas creation error", {
                error: errorMessage(err),
              });
            });
        }

        // update existing canvas
        if (canvasIdRef.current) {
          const reqbody = {
            id: canvasIdRef.current,
            data: json,
            isPublic: false,
            referredFrom: recipientDataCombiner().recipients,
            assetsRecipientElementData: recipientDataFilter().recipientsData,
            preview: canvasBase64Ref.current,
            assetIds:
              [
                ...new Set(
                  assetsIdListRef.current
                    .map((item) => item?.assetId)
                    .filter((id) => id !== undefined)
                ),
              ] || [],
            parentIpIds:
              [
                ...new Set(
                  storyIPDataRef.current
                    .map((item) => item?.ipID)
                    .filter((id) => id !== undefined)
                ),
              ] || [],
            licenseTermsIds:
              [
                ...new Set(
                  storyIPDataRef.current
                    .map((item) => item?.licenseTermsId)
                    .filter((id) => id !== undefined)
                ),
              ] || [],
          };
          updateCanvasAsync(reqbody)
            .then((res) => {
              if (res?.status === "success") {
                console.log(res?.message);
              }
            })
            .catch((err) => {
              console.log("Canvas Update error", { error: errorMessage(err) });
            });
        }
      }
    }, 3000);

    // Load the Watermark
    // fnLoadWatermark()
  };

  // ------ Testing Share Canvas Start --------

  // Get the value of the "?slugId=" query param
  const slugId = queryParams.get("slugId");

  // Function to update the meta tags with the image URL
  const fnUpdateOgMetaTags = (imageUrl) => {
    const ogImageTag = document.querySelector('meta[property="og:image"]');
    if (ogImageTag) {
      ogImageTag.setAttribute("content", imageUrl);
    }
  };

  const fnLoadWatermark = () => {
    if (!store) return;
    consoleLogonlyDev(store.toJSON());

    let w = store.width;
    let h = store.height;
    const watermarkBase64 = "/watermark.png";

    // Define the desired watermark size relative to the canvas
    const watermarkSizeFactor = 0.1; // 10% of the canvas dimension

    // Load the watermark image dimensions (assuming you have these values)
    const originalWatermarkWidth = 100; // Original width of the watermark image
    const originalWatermarkHeight = 100; // Original height of the watermark image

    // Calculate the aspect ratio of the original watermark
    const watermarkAspectRatio =
      originalWatermarkWidth / originalWatermarkHeight;

    // Determine the watermark size based on the canvas width
    let watermarkWidth = w * watermarkSizeFactor;
    let watermarkHeight = watermarkWidth / watermarkAspectRatio;

    // If the calculated height exceeds the canvas height limit, adjust the size
    if (watermarkHeight > h * watermarkSizeFactor) {
      watermarkHeight = h * watermarkSizeFactor;
      watermarkWidth = watermarkHeight * watermarkAspectRatio;
    }

    // Calculate the watermark's position to be at the bottom-right corner
    let watermarkX = w - watermarkWidth - 10; // 10px padding from the right edge
    let watermarkY = h - watermarkHeight - 10; // 10px padding from the bottom edge

    // Check if the watermark is already added
    store.pages.forEach((page) => {
      let watermarkAdded = false;
      page.children.forEach((pageItem) => {
        if (pageItem.name === "watermark") {
          console.log("Watermark already added to the page");
          // Update the watermark position and size
          pageItem.set({
            x: watermarkX,
            y: watermarkY,
            width: watermarkWidth,
            height: watermarkHeight,
          });
          watermarkAdded = true;
        }
      });

      // Add watermark if not present
      if (!watermarkAdded) {
        page.addElement({
          x: watermarkX,
          y: watermarkY,
          type: "image",
          name: "watermark",
          src: watermarkBase64,
          selectable: false,
          alwaysOnTop: true,
          showInExport: true,
          height: watermarkHeight,
          width: watermarkWidth,
        });
        console.log(
          `Watermark added to page at x: ${watermarkX}, y: ${watermarkY}`
        );
      }
    });
  };

  const addIpToCanvas = (imageUrl) => {
    const changeCanvasDimension = true;
    const dimensions = null;
    if (isMobile) {
      setOpenBottomBar(false);
      setCurOpenedPanel(null);
    }

    if (changeCanvasDimension) {
      if (dimensions) {
        store.setSize(dimensions[0], dimensions[1]);
      } else {
        store.setSize(800, 800);
      }
    }

    const width = changeCanvasDimension
      ? store.width
      : (dimensions?.[0] || 1600) / 4;
    const height = changeCanvasDimension
      ? store.height
      : (dimensions?.[1] || 1600) / 4;
    const x = changeCanvasDimension ? 0 : store.width / 4;
    const y = changeCanvasDimension ? 0 : store.height / 4;

    store.activePage?.addElement({
      type: "image",
      src: imageUrl,
      width,
      height,
      x,
      y,
    });

    setIsOnboardingOpen(false);
  };

  // useEffect(() => {
  //   fnLoadWatermark();
  // }, []);

  useEffect(() => {
    if (Number(removedWMarkCanvas) === Number(contextCanvasIdRef?.current)) {
      return;
    } else {
      fnLoadWatermark();
    }
  }, [
    store?.width,
    store?.height,
    // store?.pages?.length,
    // store?.pages[0]?.children?.length,
  ]);

  // Effect to check with the slugId and fetch the image changes
  // useEffect(() => {
  // 	const fetchImage = async () => {
  // 		if (!slugId) return
  // 		try {
  // 			const imageUrl = await apiGetOgImageForSlug(slugId)
  // 			if (imageUrl) {
  // 				consoleLogonlyDev('Image url from slug', imageUrl)

  // 				// Update OG meta tags dynamically
  // 				fnUpdateOgMetaTags(imageUrl)
  // 			} else {
  // 				consoleLogonlyDev('Failed to fetch image', imageUrl)
  // 			}
  // 		} catch (error) {
  // 			consoleLogonlyDev('Error fetching image:', error)
  // 		}
  // 	}

  // 	fetchImage()
  // }, [])

  // This has essential checks for the slugId and isAuthenticated and loads the data on the canvas
  useEffect(() => {
    // if (!componentMounted.current) {
    if (slugId && isAuthenticated) {
      fnLoadDataOnCanvas();
    } else if (!isAuthenticated && slugId && !componentMounted.current) {
      toast.error("Please login to remix the template");
      // }
      componentMounted.current = true;
    }
  }, [slugId, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      setIsOnboardingOpen(true);
    }
  }, [isAuthenticated]);

  // -------- Testing Share Canvas End ----------

  useEffect(() => {
    // request saving operation on any changes
    const handleChange = () => {
      requestSave();
    };

    // Add the change event listener
    const off = store.on("change", handleChange);

    // Clean up the event listener on unmount
    return () => {
      off();
    };
  }, []);

  // funtion for fast preview
  useEffect(() => {
    const requestSave = async () => {
      const json = store.toJSON();
      const canvasChildren = json.pages[0]?.children;

      if (canvasChildren?.length === 0) {
        contextCanvasIdRef.current = null;
        canvasBase64Ref.current = [];
        storyIPDataRef.current = null;
        setFastPreview("");
      } else {
        // check if the canvas has more than 1 page
        if (store.pages.length > 0) {
          // if yes, get the base64 for all the pages
          let previewBase64Arr = [];
          let storeBase64Arr = [];
          for (let i = 0; i < store.pages.length; i++) {
            const imgBase64 = await store.toDataURL({
              pageId: store.pages[i].id,
            });

            // remove data:image/png;base,
            const imgBase64Stripped = base64Stripper(imgBase64);

            storeBase64Arr.push(imgBase64Stripped);
            previewBase64Arr.push(imgBase64);
          }
          canvasBase64Ref.current = storeBase64Arr;
          setFastPreview(previewBase64Arr);
        }
      }
    };

    // request saving operation on any changes
    const handleChange = () => {
      requestSave();
    };

    // Add the change event listener
    const off = store.on("change", handleChange);

    // Clean up the event listener on unmount
    return () => {
      off();
    };
  }, []);

  // invite code mutuation
  const { mutateAsync: apiRedeemCode } = useMutation({
    mutationKey: "inviteCode",
    mutationFn: redeemCode,
  });

  useEffect(() => {
    if (inviteCode) {
      apiRedeemCode({
        code: inviteCode,
        address: address || solanaAddress,
      });
    }
  }, [inviteCode, address, solanaAddress]);

  useEffect(() => {
    // Show subscription modal only after onboarding is closed
    if (!isOnboardingOpen) {
      setShowSubscriptionModal(true);
    } else {
      setShowSubscriptionModal(false);
    }
  }, [isOnboardingOpen]);

  // IP portal start
  useEffect(() => {
    if (isAuthenticated && parseUrlParams()?.sp_ipid) {
      const createInitialCanvas = async () => {
        try {
          const json = store.toJSON();
          const reqbody = {
            data: json,
            referredFrom: recipientDataCombiner().recipients,
            assetsRecipientElementData: recipientDataFilter().recipientsData,
            preview: canvasBase64Ref.current,
            assetIds:
              [
                ...new Set(
                  assetsIdListRef.current
                    .map((item) => item?.assetId)
                    .filter((id) => id !== undefined)
                ),
              ] || [],
            parentIpIds:
              [
                ...new Set(
                  storyIPDataRef.current
                    .map((item) => item?.ipID)
                    .filter((id) => id !== undefined)
                ),
              ] || [],
            licenseTermsIds:
              [
                ...new Set(
                  storyIPDataRef.current
                    .map((item) => item?.licenseTermsId)
                    .filter((id) => id !== undefined)
                ),
              ] || [],
          };

          const res = await createCanvasAsync(reqbody);
          if (res?.status === "success") {
            canvasIdRef.current = res?.id;
            contextCanvasIdRef.current = res?.id;
            console.log(res?.message);
          }
        } catch (err) {
          console.log("Canvas creation error", {
            error: errorMessage(err),
          });
        }
      };

      createInitialCanvas();
    }
  }, [isAuthenticated]);

  const parseUrlParams = () => {
    const params = new URLSearchParams(window.location.search);
    return Object.fromEntries(params.entries());
  };

  const { sp_ipid, sp_source } = parseUrlParams();

  const { authenticated } = usePrivyAuth();

  const { data: ipAssetsData } = useQuery({
    queryKey: ["ipAssetsMetadata", { sp_ipid, sp_source, chainId: 1514 }],
    queryFn: apiGetIPAssetsMetadata,
    enabled: !!sp_ipid,
  });

  useEffect(() => {
    // if no sp_ipid params are found, end the function
    if (!parseUrlParams()?.sp_ipid) {
      console.log("No sp_ipid found in the URL");
      return;
    }

    //check if user is logged in, if not, show a message to log in
    if (!isAuthenticated) toast.error("Please login to continue");

    const splitAndFilter = (str) => str?.split(",").filter(Boolean) || [];

    const validateParams = (params) => {
      if (!params.sp_ipid) {
        console.error("Missing required parameter: sp_ipid");
        return false;
      }

      if (params.sp_source) {
        const sources = splitAndFilter(params.sp_source);
        if (
          !sources.every(
            (s) => /^[a-zA-Z0-9]+$/.test(s) && STORY_KNOWN_APP_IDS.has(s)
          )
        ) {
          console.error("Invalid or unknown sp_source value");
          return false;
        }
      }
      return true;
    };

    if (validateParams(parseUrlParams())) {
      console.log("DATA", ipAssetsData);
      storyIPDataRef.current = ipAssetsData?.data?.data?.ipIds;

      try {
        ipAssetsData?.data?.data?.IpData.forEach((item, idx) => {
          if (item?.ipMetadata?.mediaUrl) {
            addIpToCanvas(item?.ipMetadata?.mediaUrl);
          } else {
            toast.error(item?.error);
          }
        });
      } catch (e) {
        toast.error(e);
      }
    }
  }, [ipAssetsData, authenticated, chainId]);
  // IP portal end

  return (
    <>
      <div
        className=""
        style={{
          width: "100vw",
          height: height + "px",
          display: "flex",
          flexDirection: "column",
        }}
        onDrop={handleDrop}
      >
        <div
          style={{
            height: isMobile ? "calc(100% - 8px)" : "calc(100% - 75px)",
          }}
        >
          {!isMobile && (
            <div className="">
              <TopbarSection />
            </div>
          )}
          <PolotnoContainer className="min-h-400 md:min-h-full">
            <div
              id="second-step"
              className={`${isMobile ? "hidden" : ""} md:block mx-0 md:mx-2`}
            >
              <SidePanelWrap>
                <SidePanel store={store} sections={sections} />
              </SidePanelWrap>
            </div>
            <WorkspaceWrap>
              <div className="mb-2 md:ml-0 mx-2 my-2">
                {!isMobile && <Toolbar store={store} />}
                {isMobile && <MobileTopbar />}
              </div>
              <Workspace
                store={store}
                components={{
                  Tooltip,
                }}
                backgroundColor="#e8e8ec"
              />

              {/* Bottom section */}
              {!isMobile && <ZoomButtons store={store} />}
              {!isMobile && <PagesTimeline store={store} />}
              {isMobile && (
                <div className="flex flex-col">
                  {/* <SpeedDialX /> */}
                  <div className="flex justify-between">
                    <BgRemover />

                    <Button
                      onClick={() => {
                        fnOpenPanel("mobPanelUpload");
                        setCurOpenedTabLevel1("ai");
                      }}
                      className="p-2 !py-0 mr-4 mb-2 text-black leading-0 bg-[#e1f16b] rounded-lg"
                    >
                      <HiOutlineSparkles size={20} />
                    </Button>
                  </div>
                  <div className="flex flex-row w-full justify-between items-center rounded-lg ">
                    {!isLoggedOut && (
                      <SubscriptionModal defaultOpen={false} bottomBar={true} />
                    )}
                  </div>
                  <MobileBottombar />
                </div>
              )}

              <SignMesasgeModal />

              {!isMobile && (
                <div>
                  <div className="flex flex-row justify-between items-center rounded-lg ">
                    <BgRemover />
                    {/* Quick Tour on the main page */}
                    <div className="flex flex-row ">
                      {/* {!isLoggedOut && showSubscriptionModal && <SubscriptionModal defaultOpen={true} bottomBar={true} />} */}
                      {/* {!isLoggedOut && <SubscriptionModal defaultOpen={true} bottomBar={true} />} */}
                      {/* {alert(isOnboardingOpen)} */}
                      {/* Speed Dial - Clear Canvas, etc.. Utility Fns */}
                      <SpeedDialX />
                      <OnboardingModal />

                      <div
                        className="m-1 ml-2 flex flex-row justify-end align-middle cursor-pointer"
                        onClick={async () => {
                          setCurrentStep(0);
                          if (isConnected) {
                            setIsOpen(true);
                            setSteps(OnboardingStepsWithShare);
                          } else {
                            setIsOpen(true);
                            setSteps(OnboardingSteps);
                          }
                        }}
                      >
                        <FcIdea className="m-2" size="16" />
                        {/* <div className="hidden md:block w-full m-2 ml-0 text-sm text-yellow-600">Need an intro?</div> */}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row w-full justify-between items-center rounded-lg ">
                    {!isLoggedOut && showSubscriptionModal && (
                      <SubscriptionModal defaultOpen={true} bottomBar={true} />
                    )}
                  </div>
                </div>
              )}
            </WorkspaceWrap>
          </PolotnoContainer>
        </div>
      </div>
    </>
  );
};

export default Editor;
