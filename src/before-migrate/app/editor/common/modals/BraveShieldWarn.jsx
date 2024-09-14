import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
  Spinner,
  Checkbox,
} from "@material-tailwind/react";
import { LOCAL_STORAGE } from "../../../../data";
import { BraveLogo } from "../../../../assets";

const BraveShieldWarn = () => {
  const [open, setOpen] = useState(true);

  const handleOpen = () => setOpen(!open);

  const handleCheckbox = (e) => {
    if (e.target.checked) {
      localStorage.setItem(LOCAL_STORAGE.braveShieldWarn, true);
    } else {
      localStorage.removeItem(LOCAL_STORAGE.braveShieldWarn, false);
    }
  };

  return (
    <>
      <Dialog
        size="sm"
        open={open}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="outline-none"
      >
        <DialogHeader className="gap-2 border-b border-gray-300">
          <img src={BraveLogo} alt="brave logo" className="h-10 w-10" />
          <Typography variant="h5" color="blue-gray">
            Brave Shield Warning
          </Typography>
        </DialogHeader>
        <DialogBody>
          <Typography variant="h6" color="blue-gray">
            Keep Brave shields off for better experience.
          </Typography>
        </DialogBody>

        <DialogFooter>
          <Checkbox
            color="yellow"
            className="outline-none"
            label="Don't show this again"
            onChange={handleCheckbox}
          />

          <Button
            color="lenspostLime"
            onClick={handleOpen}
            ripple="light"
            className="ml-4 outline-none bg-[#e1f16b] text-black"
          >
            Ok
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default BraveShieldWarn;
