import React, { useContext } from "react";
import { Button, Card } from "@blueprintjs/core";

import { LazyLoadImage } from "react-lazy-load-image-component";

import { useStore } from "../../../../../../../hooks/polotno";
import { Context } from "../../../../../../../providers/context/ContextProvider";
import { replaceImageURL } from "../../../../../../../utils";

// Design card component start - 23Jun2023
const DesignCard = ({
  item,
  preview,
  json,
  onDelete,
  onPublic,
  isPublic,
  openTokengateModal,
  onOpenTagModal,
}) => {
  const {
    fastPreview,
    contextCanvasIdRef,
    referredFromRef,
    preStoredRecipientDataRef,
    designModal,
    setDesignModal,
    isMobile,
    setOpenLeftBar
  } = useContext(Context);
  const store = useStore();

  const handleClickOrDrop = () => {
    if(isMobile) {
      setOpenLeftBar(false)
    }
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
        <Button icon="trash" onClick={onDelete} />
        {!isMobile && (
          <Button
            className="ml-1"
            onClick={() => {
              setDesignModal(true);
              onOpenTagModal();
            }}
            icon="share"
          />
        )}
      </div>
    </Card>
  );
};

// Design card component end - 23Jun2023

export default DesignCard;
