import {
  Button,
  Chip,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  IconButton,
  Input,
  Spinner,
  Switch,
  Typography,
} from "@material-tailwind/react";
import React, { useContext, useState } from "react";
import { Context } from "../../../../../../../providers/context";
import { toast } from "react-toastify";
import {
  apiGenerateShareSlug,
  changeCanvasVisibility,
  tokengateCanvasById,
  updateCanvas,
} from "../../../../../../../services";
import { handleChange } from "../../utils";
import { InputBox, InputErrorMsg } from "../../../../../common";
import { errorMessage } from "../../../../../../../utils";

const ShareWithTagsModal = ({ displayImg, canvasId, isPublic }) => {
  const { designModal, setDesignModal } = useContext(Context);
  // Store input as tags array
  const [tags, setTags] = useState("");
  // Switch States
  const [switchState, setSwitchState] = useState(false);
  const [loading, setLoading] = useState(false);

  const handler = () => {
    setDesignModal(false);
  };

  // Modal States
  const [modal, setModal] = useState({
    isOpen: false,
    isPublic: isPublic ? true : false,
    isTokengate: false,
    isNewDesign: false,
    stTokengateIpValue: "",
    isError: false,
    errorMsg: "",
    canvasId: canvasId,
  });

  const filterTagsData = () => {
    if (tags) {
      const rmSpace = tags.replace(/\s/g, "");
      const splitTags = rmSpace.split(",");
      return splitTags;
    } else {
      return [];
    }
  };

  const handleSubmit = async () => {
    if (switchState && modal?.isError) return;

    setLoading(true);

    if (filterTagsData().length > 0) {
      try {
        await updateCanvas({
          id: modal.canvasId,
          tags: filterTagsData(),
        });
      } catch (error) {
        console.log("updateCanvas error", errorMessage(error));
      }
    }

    if (switchState && !modal?.isError && modal?.stTokengateIpValue) {
      try {
        await tokengateCanvasById({
          id: modal.canvasId,
          gatewith: modal.stTokengateIpValue,
        });
      } catch (error) {
        console.log("tokengateCanvasById error", errorMessage(error));
      }
    }

    try {
      await changeCanvasVisibility({
        id: modal.canvasId,
        isPublic: !isPublic,
      }).then((res) => {
        if (res?.status === "success") {
          setLoading(false);
          toast.success("Design made public");
          handler();
        }
      });
    } catch (error) {
      setLoading(false);
      toast.error(errorMessage(error));
    }
    setLoading(false);

    handler();
  };

  // Function to Generate Slug
  const fnGenerateSlug = async () => {
    setLoading(true);
    console.log("fnGenerateSlug");

    console.log("canvasId", modal?.canvasId);
    const slugRes = await apiGenerateShareSlug(modal?.canvasId);

    console.log("slugRes", slugRes);

    toast.success("Link copied to clipboard");
    // navigator.clipboard.writeText(`http:localhost:5173/design/${slugRes?.data?.message}`);
    const baseURL = window.location.origin;
    navigator.clipboard.writeText(
      `${baseURL}/?slugId=${slugRes?.data?.message}`
    );
    setLoading(false);
    handler();
  };

  return (
    <>
      <Dialog
        size="sm"
        open={designModal}
        handler={!loading ? handler : null}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="appFont justify-between border-b border-gray-300">
          <Typography variant="h5" color="blue-gray">
            Make this Design Public
          </Typography>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={!loading ? handler : null}
            className="appFont outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>

        <DialogBody className="m-2">
          <div className=" flex flex-col items-center my-2">
            {displayImg && (
              <img className="h-64 w-fit" src={displayImg} alt="" />
            )}
          </div>

          <div className="flex flex-col justify-start mt-4">
            {/* <div className="">
              Add some creative tags to help others find your design{" "}
            </div> */}
            <Input
              autoFocus={true}
              // className="w-full mt-2 border border-gray-300 rounded-md p-2"
              label="Add some creative tags to help others find your design"
              placeholder=""
              value={tags}
              onChange={(e) => {
                setTags(e.target.value);
              }}
            />

            <div className="mt-2 flex justify-between">
              <div className="m-2 ml-0 font-bold appFont">
                {" "}
                Tokengate this Template
              </div>

              <div className="m-2">
                <Switch
                  checked={switchState}
                  onChange={() => setSwitchState(!switchState)}
                  // color="blue"
                />
              </div>
            </div>
            <div className="text-sm font-medium appFont">
              Tokengate this canvas with specific contract address or with a
              Hey(Lenster) post
            </div>
            {switchState && (
              <div className="mt-4">
                {switchState && (
                  <>
                    <InputBox
                      value={modal?.stTokengateIpValue}
                      onFocus={(e) => handleChange(e, modal, setModal)}
                      onChange={(e) => handleChange(e, modal, setModal)}
                      // placeholder={"contract address / Lenster post link"}
                      label={"Enter contract address / Hey (Lenster) post link"}
                    />
                    {modal?.isError && (
                      <InputErrorMsg message={modal?.errorMsg} />
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </DialogBody>
        <DialogFooter>
          <div className="">
            <Button
              variant="filled"
              disabled={loading || (switchState && modal?.isError)}
              loading={loading}
              // color="blue"
              // onClick={() => setOpen(false)}
              onClick={handleSubmit}
              className="flex justify-center items-center gap-2"
            >
              {/* {switchState ? "Tokengate and Make Public" : " Make Public"} */}
              {modal?.isPublic ? "Make Private" : "Make Public"}
            </Button>
          </div>{" "}
          <div className="ml-2">
            <Button
              variant="outline"
              color=""
              onClick={fnGenerateSlug}
              loading={loading}
            >
              Copy Link
            </Button>
          </div>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default ShareWithTagsModal;
