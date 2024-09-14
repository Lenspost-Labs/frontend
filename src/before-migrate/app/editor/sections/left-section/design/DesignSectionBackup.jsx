import React, { useContext, useEffect, useRef, useState } from "react";

import { SectionTab } from "polotno/side-panel";
import { MyDesignIcon } from "../../../../../assets/assets";

import { Button, Card, Menu, MenuItem, Position } from "@blueprintjs/core";

import { Popover2 } from "@blueprintjs/popover2";
import { useAccount } from "wagmi";
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
  MyDesignReacTour,
  SearchComponent,
  ShareWithTagsModal,
} from "../../../common";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useStore } from "../../../../../hooks/polotno";
import { Context } from "../../../../../providers/context/ContextProvider";
import {
  fnLoadMore,
  errorMessage,
  randomThreeDigitNumber,
  replaceImageURL,
} from "../../../../../utils";
import { LoadingAnimatedComponent } from "../../../common";
import { fnPageHasElements } from "../../../../../utils/fnPageHasElements";
import { useAppAuth, useReset } from "../../../../../hooks/app";

// Design card component start - 23Jun2023

const DesignCard = ({
  item,
  preview,
  json,
  onDelete,
  onPublic,
  isPublic,
  openTokengateModal,
}) => {
  const {
    fastPreview,
    contextCanvasIdRef,
    referredFromRef,
    preStoredRecipientDataRef,
    designModal,
    setDesignModal,
  } = useContext(Context);
  const store = useStore();

  const handleClickOrDrop = () => {
    store.loadJSON(json);
    contextCanvasIdRef.current = item.id;
    referredFromRef.current = item.referredFrom;
    preStoredRecipientDataRef.current = item.assetsRecipientElementData;
  };

  return (
    <Card
      className="relative p-0 m-1 rounded-lg h-fit"
      interactive
      onDragEnd={handleClickOrDrop}
      onClick={handleClickOrDrop}
    >
      <div className="rounded-lg overflow-hidden">
        <LazyLoadImage
          placeholderSrc={replaceImageURL(preview)}
          effect="blur"
          src={
            contextCanvasIdRef.current === item.id
              ? fastPreview[0]
              : replaceImageURL(preview)
          }
          alt="Preview Image"
        />
      </div>

      <div
        style={{
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          // padding: "3px",
        }}
      >
        {/* {design.name} */}
      </div>
      <div
        style={{ position: "absolute", top: "5px", right: "5px" }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* <Popover2
          content={
            <Menu>
              <MenuItem
                icon="globe"
                text={isPublic ? "Make Private" : "Make Public"}
                onClick={onPublic}
              />
              <MenuItem
                icon="layout-circle"
                text="Tokengate & Make Public"
                onClick={openTokengateModal}
              />
              <MenuItem icon="trash" text="Delete" onClick={onDelete} />
            </Menu>
          }
          position={Position.BOTTOM}
        >
          <div id="makePublic">
            <Button icon="more" />
          </div>
        </Popover2> */}

        <Button icon="trash" />
        <Button onClick={() => setDesignModal(!designModal)} icon="share" />
      </div>
    </Card>
  );
};

// Design card component end - 23Jun2023

export const DesignPanel = () => {
  const { isAuthenticated } = useAppAuth();
  const { resetState } = useReset();
  const { fastPreview, contextCanvasIdRef, designModal } = useContext(Context);
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
      queryClient.invalidateQueries(["community-pool"], { exact: true });
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

      <Button
        className="m-2 p-1"
        onClick={() => {
          if (fnPageHasElements(store)) {
            setModal({ ...modal, isOpen: true, isNewDesign: true });
          }
        }}
      >
        Create new design
      </Button>

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

      <MyDesignReacTour />
      {/* This is the Modal that Appears on the screen for Confirmation - 25Jun2023 */}

      {/* New Design card start - 23Jun2023 */}
      {/* For reference : design - array name, design.id - Key, design.preview - Url  */}
      {/*   Pass these onto Line 25 */}
      {isError ? (
        <ErrorComponent error={error} />
      ) : data?.pages[0]?.data?.length > 0 ? (
        <div className="overflow-y-auto grid grid-cols-2" id="RecentDesigns">
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
                    openTokengateModal={() =>
                      setModal({
                        ...modal,
                        isOpen: true,
                        isTokengate: true,
                        canvasId: item?.id,
                      })
                    }
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
      <ShareWithTagsModal setOpenModalProp={true} displayImg={item} />
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
