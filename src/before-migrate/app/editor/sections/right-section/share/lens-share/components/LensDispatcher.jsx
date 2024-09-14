import React, { useContext, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Typography,
  IconButton,
  Spinner,
} from "@material-tailwind/react";
import {
  getBroadcastData,
  setBroadcastOnChainTx,
  signSetDispatcherTypedData,
} from "../../../../../../../services";
import { toast } from "react-toastify";
import { ERROR, LOCAL_STORAGE } from "../../../../../../../data";
import { saveToLocalStorage } from "../../../../../../../utils";
import { Context } from "../../../../../../../providers/context";

const LensDispatcher = ({ title, className }) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setLensAuthState } = useContext(Context);

  const handleOpen = () => setOpen(!open);

  // set the dispatcher true or false
  const setDispatcherFn = async () => {
    try {
      setLoading(true);

      const { id, typedData } = await getBroadcastData();

      const { signature } = await signSetDispatcherTypedData(typedData);

      const boadcastResult = await setBroadcastOnChainTx(id, signature);

      if (boadcastResult?.message?.txHash || boadcastResult?.message?.txId) {
        saveToLocalStorage(LOCAL_STORAGE.dispatcher, true);
        setLensAuthState((cur) => ({ ...cur, dispatcherStatus: true }));
        handleOpen();
        setLoading(false);
        toast.success("Signless transactions enebled");
      } else {
        setLoading(false);
        handleOpen();
        toast.error(ERROR.SOMETHING_WENT_WRONG);
      }
    } catch (err) {
      setLoading(false);
      handleOpen();
      console.log("error setting signless transactions: ", err);
      toast.error("Error setting signless transactions");
    }
  };

  return (
    <>
      <Button
        onClick={handleOpen}
        // color="yellow"
        className={`${className}`}
      >
        {title}
      </Button>
      <Dialog
        size="sm"
        open={open}
        handler={loading ? null : handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="justify-between border-b border-gray-300">
          <Typography variant="h5" 
          color="blue-gray"
          >
            Enable signless transactions
          </Typography>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={loading ? null : handleOpen}
            className="outline-none"
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
        <DialogBody>
          <Typography variant="h6" color="blue-gray">
            Enable signless transactions to post on Lens without signing every
            transaction.
          </Typography>
        </DialogBody>
        <DialogFooter>
          <Button
            disabled={loading}
            variant="gradient"
            // color="yellow"
            onClick={setDispatcherFn}
            className="flex gap-3 items-center"
          >
            <span>Enable</span>
            {loading && <Spinner color="red" />}
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default LensDispatcher;
