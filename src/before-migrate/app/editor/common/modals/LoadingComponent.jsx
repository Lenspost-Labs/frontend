import {
  Button,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import React, { useContext, useEffect, useState } from "react";
import GoSignIn from "@meronex/icons/go/GoSignIn";
import { useLocalStorage, useLogout } from "../../../../hooks/app";
import { Context } from "../../../../providers/context";

const LoadingComponent = ({ isLoading, text }) => {
  const { logout } = useLogout();
  const { authToken } = useLocalStorage();
  const [open, setOpen] = useState(false);
  const { setIsLoading, setText } = useContext(Context);

  const handleOpen = () => setOpen(!open);

  // if loading show the dialog
  useEffect(() => {
    if (isLoading) {
      setOpen(true);
    } else if (!isLoading) {
      setOpen(false);
    }
  }, [isLoading]);

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
          <GoSignIn />
          <Typography variant="h5" color="blue-gray">
            Auth
          </Typography>
        </DialogHeader>
        <DialogBody>
          <div className="flex items-center gap-2 ">
            <Typography variant="h6" color="blue-gray">
              {text ? text : "Done"}
            </Typography>
            <Spinner color="blue" />
          </div>
        </DialogBody>

        <DialogFooter>
          <Button
            className="ml-4 outline-none"
            color="red"
            onClick={() => {
              logout();
              setOpen(false);
              setIsLoading(false);
              setText("");
            }}
          >
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default LoadingComponent;
