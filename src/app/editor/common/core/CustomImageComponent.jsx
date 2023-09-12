// Seperate component for Lazy loading (CustomImage) - 29Jun2023

import { LazyLoadImage } from "react-lazy-load-image-component";
import { Button, Card, Menu, MenuItem, Position } from "@blueprintjs/core";
import { Popover2 } from "@blueprintjs/popover2";
import { replaceImageURL } from "../../../../utils/replaceUrl";
import { useEffect, useState } from "react";
import { useStore } from "../../../../hooks";
import { useContext } from "react";
import { Context } from "../../../../context/ContextProvider";

// Custom Image card component start - 23Jun2023
const CustomImageComponent = ({
  preview,
  dimensions,
  hasOptionBtn,
  onDelete,
  isLensCollect,
  changeCanvasDimension,
  recipientWallet,
}) => {
  const store = useStore();
  const [base64Data, setBase64Data] = useState("");
  const { lensCollectRecipientRef, assetsRecipientRef } = useContext(Context);

  // convert to base64
  const getBase64 = async (image) => {
    const response = await fetch(image);
    const blob = await response.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(`data:image/svg+xml;base64,${base64String}`);
      };
      reader.readAsDataURL(blob);
    });
  };

  // funtion to check if preview has .svg extension
  const isSVG = (image) => {
    return image?.includes(".svg");
  };

  // Function to add image on the Canvas/Page
  const handleClickOrDrop = () => {
    // {
    //   !json &&
    // Instead of `isBackground`, use `changeCanvasDimension`

    changeCanvasDimension && store.setSize(dimensions[0], dimensions[1]);

    var widthOnCanvas = 400;
    var heightOnCanvas = 400;

    if (dimensions && dimensions[0] && dimensions[1]) {
      widthOnCanvas = dimensions[0] / 4;
      heightOnCanvas = dimensions[1] / 4;
    }

    store.activePage?.addElement({
      type: "image",
      src: base64Data, //Image URL
      width: changeCanvasDimension ? store.width : widthOnCanvas,
      height: changeCanvasDimension ? store.height : heightOnCanvas,
      x: changeCanvasDimension ? 0 : store.width / 4,
      y: changeCanvasDimension ? 0 : store.height / 4,
    });

    // if nft is a lens collect, add it to the referredFromRef but check if a handle is already
    if (isLensCollect?.isLensCollect) {
      const isHandlePresent = lensCollectRecipientRef.current.some(
        (element) => element.handle === isLensCollect?.lensHandle
      );

      if (!isHandlePresent) {
        // add to the lensCollectRecipientRef
        lensCollectRecipientRef.current.push({
          elementId: store.selectedElements[0].id,
          handle: isLensCollect?.lensHandle,
        });
      }
    }

    // if nft is a featured bg, and has recipientWallet / wallet address/handle is present, add it to the assetsRecipientRef but check if a handle is already
    if (recipientWallet) {
      const isHandlePresent = assetsRecipientRef.current.some(
        (element) => element.handle === recipientWallet
      );

      if (!isHandlePresent) {
        // add to the assetsRecipientRef
        assetsRecipientRef.current.push({
          elementId: store.selectedElements[0].id,
          handle: recipientWallet + ".lens",
        });
      }
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const image = await getBase64(replaceImageURL(preview));
        setBase64Data(image);
      } catch (error) {
        console.error("Error fetching or converting the image:", error);
      }
    };

    if (isSVG(replaceImageURL(preview))) {
      fetchImage();
    } else {
      setBase64Data(replaceImageURL(preview));
    }
  }, [preview]);

  return (
    <>
      <Card
        className="relative p-0 m-1 rounded-lg h-fit"
        interactive
        onDragEnd={handleClickOrDrop}
        onClick={handleClickOrDrop}
      >
        <div className="rounded-lg overflow-hidden">
          <LazyLoadImage
            placeholderSrc={base64Data}
            effect="blur"
            src={base64Data}
            alt="Preview Image"
          />
        </div>

        {/* if nft is a lens collect */}
        {isLensCollect?.isLensCollect || recipientWallet ? (
          <>
            <div
              title="Collected from Lens"
              // className="bg-[#E1F26C] p-1 rounded-lg absolute top-2 left-2 opacity-60 hover:opacity-100"
              className="text-white text-xs bg-[#161616] px-2 py-0.5 rounded-md absolute top-2 right-2 opacity-96 hover:opacity-80"
              onClick={(e) => {
                e.stopPropagation();

                const onlyHandle =
                  isLensCollect?.lensHandle.split("@")[1] ||
                  recipientWallet.split("@")[1];
                window.open(`https://lenster.xyz/u/${onlyHandle}`, "_blank");
              }}
            >
              {isLensCollect?.lensHandle || recipientWallet}
            </div>
          </>
        ) : (
          <></>
        )}

        {hasOptionBtn && (
          <div
            style={{ position: "absolute", top: "5px", right: "5px" }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Popover2
              content={
                <Menu>
                  <MenuItem icon="trash" text="Delete" onClick={onDelete} />
                </Menu>
              }
              position={Position.BOTTOM}
            >
              <div id="makePublic">
                <Button icon="more" />
              </div>
            </Popover2>
          </div>
        )}
      </Card>
    </>
  );
};
export default CustomImageComponent;
// Custom Image card component end - 23Jun2023
