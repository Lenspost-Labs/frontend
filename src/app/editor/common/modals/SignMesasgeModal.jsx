import {
  Button,
  Dialog,
  DialogBody,
  DialogHeader,
  IconButton,
  Spinner,
  Typography,
} from "@material-tailwind/react";
import { useAccount } from "wagmi";
import { Context } from "../../../../providers/context";
import { useContext } from "react";
import { addressCrop } from "../../../../utils";
const SignMesasgeModal = () => {
  const { showSignMessageModal, setShowSignMessageModal } = useContext(Context);
  const { address } = useAccount();

  const handleSignMessageModal = () => {
    setShowSignMessageModal(!showSignMessageModal);
  };
  return (
    <>
      <Dialog className="p-0" size="xs" open={showSignMessageModal}>
        <DialogHeader className="justify-between">
          <Typography variant="h5" className=" text-gray-600 font-normal">
            Sign a Message
          </Typography>
          <IconButton color="gray" size="sm" variant="text">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              className="h-4 w-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </IconButton>
        </DialogHeader>
        <DialogBody className="overflow-y-scroll">
          <div className="flex flex-col mx-4 gap-2">
            <p>You have to sign a message to continue using Poster.</p>
            <p>
              Your address:{" "}
              <span className="font-medium">{addressCrop(address)}</span>
            </p>
          </div>
          <div className="flex max-w-xs mx-auto flex-col gap-5 m-4">
            <Button
              size="md"
              color="gray"
              className="flex flex-row justify-center items-center text-center"
            >
              Sign Message
            </Button>
            <button className="text-red-500 font-medium text-center">
              Disconnect Wallet
            </button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default SignMesasgeModal;
