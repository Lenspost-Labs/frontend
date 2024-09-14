import React, { useContext, useEffect, useState } from "react";

import { SectionTab } from "polotno/side-panel";
import { MyDesignIcon } from "../../../../../assets/assets";

import { Card } from "@blueprintjs/core";

import {
  changeCanvasVisibility,
  deleteCanvasById,
  getAllCanvas,
  tokengateCanvasById,
} from "../../../../../services";
import { toast } from "react-toastify";
import { LazyLoadImage } from "react-lazy-load-image-component";
import {
  CompModal,
  ConnectWalletMsgComponent,
  ErrorComponent,
  LoadMoreComponent,
  MessageComponent,
  ShareWithTagsModal,
} from "../../../common";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useStore } from "../../../../../hooks/polotno";
import { Context } from "../../../../../providers/context/ContextProvider";
import { fnLoadMore, errorMessage } from "../../../../../utils";
import { LoadingAnimatedComponent } from "../../../common";
import { fnPageHasElements } from "../../../../../utils/fnPageHasElements";
import { useAppAuth, useReset } from "../../../../../hooks/app";
import DesignCard from "./components/cards/DesignCard";
import assetNewDesign from "./assets/NewDesign.svg";

export const DesignPanel = () => {
  const { isAuthenticated } = useAppAuth();
  const { resetState } = useReset();
  const {
    fastPreview,
    contextCanvasIdRef,
    designModal,
    isMobile,
    setOpenLeftBar,
  } = useContext(Context);
  const [modalImageLink, setModalImageLink] = useState("");
  const store = useStore();

  // My Design Modal
  const [modal, setModal] = useState({
    isOpen: false,
    isTokengate: false,
    isNewDesign: false,
    stTokengateIpValue: "",
    isError: false,
    errorMsg: "",
    canvasId: null,
  });
  const [query, setQuery] = useState("");

  // get all canvas
  const queryClient = useQueryClient();
  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["my-designs"],
    getNextPageParam: (prevData) => prevData.nextPage,
    queryFn: ({ pageParam = 1 }) => getAllCanvas(pageParam),
    enabled: isAuthenticated ? true : false,
  });

  // mutationFn delete a canvas
  const {
    mutate: deleteCanvas,
    isError: isDeleteError,
    error: deleteError,
  } = useMutation({
    mutationKey: "delete-canvas",
    mutationFn: deleteCanvasById,
    onSuccess: (data) => {
      toast.success(data?.message);
      queryClient.invalidateQueries(["my-designs"], { exact: true });
    },
  });

  // mutationFn change canvas visibility (public/private)
  const {
    mutate: changeVisibility,
    isError: isVisibilityError,
    error: visibilityError,
  } = useMutation({
    mutationKey: "change-visibility",
    mutationFn: changeCanvasVisibility,
    onSuccess: (data) => {
      if (modal.isTokengate) {
        toast.success("Canvas is tokengated and made public"),
          setModal({
            isOpen: false,
            isTokengate: false,
            isNewDesign: false,
            stTokengateIpValue: "",
            isError: false,
            errorMsg: "",
            canvasId: null,
          });
      } else {
        toast.success(data?.message);
      }
      // queryClient.invalidateQueries(["community-pool"], { exact: true });
    },
  });

  // mutationFn to tokengate a canvas
  const {
    mutate: tokengateCanvas,
    isError: isTokengateError,
    error: tokengateError,
  } = useMutation({
    mutationKey: "tokengate-canvas",
    mutationFn: tokengateCanvasById,
    onSuccess: () => {
      changeVisibility({ id: modal.canvasId, isPublic: true });
    },
  });

  // Function to delete all the canvas on confirmation - 25Jun2023
  const fnDeleteCanvas = () => {
    // clear all the variables
    resetState();

    setModal({ ...modal, isOpen: false, isNewDesign: false });
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    fnLoadMore(hasNextPage, fetchNextPage);
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (isDeleteError) {
      toast.error(errorMessage(deleteError));
    } else if (isVisibilityError) {
      toast.error(errorMessage(visibilityError));
    } else if (isTokengateError) {
      toast.error(errorMessage(tokengateError));
    }
  }, [isDeleteError, isVisibilityError, isTokengateError]);

  if (!isAuthenticated) {
    return <ConnectWalletMsgComponent />;
  }

  // Show Loading - 06Jul2023
  if (isLoading) {
    return <LoadingAnimatedComponent />;
  }

  return (
    <div className="h-full flex flex-col">
      {/* <h1 className="text-lg">My Files</h1> */}
      {!isMobile && (
        <>
          {modal.isOpen && modal.isTokengate && (
            <CompModal
              modal={modal}
              setModal={setModal}
              tokengatingIp="contract address / Lenster post link"
              icon={"lock"}
              ModalTitle={"Tokengate this template"}
              ModalMessage={`
          Please enter the Contract Address or the Lenster Post Link to tokengate this template.
          `}
              customBtn={"Confirm"}
              onClickFunction={() =>
                tokengateCanvas({
                  id: modal.canvasId,
                  gatewith: modal.stTokengateIpValue,
                })
              }
            />
          )}

          {modal.isOpen && modal.isNewDesign && (
            <CompModal
              modal={modal}
              setModal={setModal}
              ModalTitle={"Are you sure to create a new design?"}
              ModalMessage={"This will remove all the content from your canvas"}
              onClickFunction={() => fnDeleteCanvas()}
            />
          )}

          {/* <MyDesignReacTour /> */}
        </>
      )}
      {isError ? (
        <ErrorComponent error={error} />
      ) : data?.pages[0]?.data?.length > 0 ? (
        <div className="overflow-y-auto grid grid-cols-2" id="RecentDesigns">
          {/* Create new design - Image */}
          <div
            className="cursor-pointer m-1 hover:shadow-sm"
            onClick={() => {
              if (isMobile) {
                setOpenLeftBar(false);
                resetState();
              }
              if (fnPageHasElements(store)) {
                setModal({ ...modal, isOpen: true, isNewDesign: true });
              }
            }}
          >
            <LazyLoadImage
              className="rounded-lg hover:shadow-lg"
              src={assetNewDesign}
              alt={"new design"}
            />
          </div>
          {contextCanvasIdRef.current === null && fastPreview[0] && (
            <Card className="relative p-0 m-1" interactive>
              <img src={fastPreview[0]} alt="" />
            </Card>
          )}
          {data?.pages
            .flatMap((item) => item?.data)
            .map((item) => {
              return (
                <>
                  <DesignCard
                    item={item}
                    json={item?.data}
                    preview={
                      item?.imageLink != null &&
                      item?.imageLink.length > 0 &&
                      item?.imageLink[0]
                    }
                    key={item.id}
                    onDelete={() => deleteCanvas(item.id)}
                    onPublic={() => {
                      item?.isPublic
                        ? changeVisibility({ id: item?.id, isPublic: false })
                        : changeVisibility({ id: item?.id, isPublic: true });
                    }}
                    isPublic={item?.isPublic}
                    onOpenTagModal={() => {
                      setModal({
                        ...modal,
                        canvasId: item?.id,
                      });
                      setModalImageLink(item?.imageLink);
                    }}
                    openTokengateModal={() =>
                      setModal({
                        ...modal,
                        isOpen: true,
                        isTokengate: true,
                        canvasId: item?.id,
                      })
                    }
                    hasWatermark={item?.watermark}
                  />
                </>
              );
            })}

          <LoadMoreComponent
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      ) : (
        <div id="RecentDesigns">
          {/* <MessageComponent message="You have not created any design yet" /> */}
          <MessageComponent message="Start Creating you new design" />
        </div>
      )}

      {/* New Design card end - 23Jun2023 */}
      {designModal && (
        <ShareWithTagsModal
          canvasId={modal.canvasId}
          displayImg={modalImageLink}
        />
      )}
    </div>
  );
};

// define the new custom section
const DesignSection = {
  name: "My Designs",
  Tab: (props) => (
    <SectionTab name="My Files" {...props}>
      <MyDesignIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: DesignPanel,
};

export default DesignSection;
