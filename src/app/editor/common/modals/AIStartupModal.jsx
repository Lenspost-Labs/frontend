import React from "react";
import { CompSearch } from "../../sections/left-section/image/AIImageSection";
import { AIIcon } from "../../../../assets/assets";
import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
} from "@material-tailwind/react";

const AIStartupModal = () => {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <div className="mr-12">
        <Button
          onClick={handleOpen}
          className="p-4 py-2 text-black bg-[#e1f16b] rounded-md"
        >
          <AIIcon />
          <span className="ml-2">AI</span>
        </Button>
        <Dialog open={open} handler={handleOpen}>
          <DialogHeader>Poster AI Magic</DialogHeader>
          <DialogBody>
            <div className="flex flex-row justify-between items-center max-h-full min-h-full">
              {" "}
              <>
                <div className="w-1/4"> Left Section </div>
                <div className="w-3/4">
                  <CompSearch />
                </div>
              </>
            </div>
          </DialogBody>
        </Dialog>
      </div>
    </>
  );
};

export default AIStartupModal;
