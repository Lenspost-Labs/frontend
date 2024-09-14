import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  IconButton,
  Typography,
  MenuItem,
} from "@material-tailwind/react";

import { SolanaLogo } from "../../../../../../assets";
import { useSolanaWallet } from "../../../../../../hooks/solana";

const SolanaWallets = ({title, className}) => {
  const {
    solanaWallets,
    solanaSelect,
    solanaConnecting,
    solanaWallet,
    solanaConnected,
  } = useSolanaWallet();
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen((cur) => !cur);

  useEffect(() => {
    if (solanaConnected) {
      setOpen(false);   
    }
  }, [solanaConnected]);

  return (
    <>
      <Button
        onClick={handleOpen}
        size="lg"
        color="black"
        className={`flex items-center justify-center gap-3 outline-none my-2 ${className}`}
      >
        <img src={SolanaLogo} alt="solana" className="h-6 w-6" />
        {title}
      </Button>
      <Dialog
        className="outline-none"
        size="xs"
        open={open}
        handler={handleOpen}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
      >
        <DialogHeader className="justify-between">
          <Typography variant="h5" color="blue-gray">
            Connect a Wallet
          </Typography>
          <IconButton
            color="blue-gray"
            size="sm"
            variant="text"
            onClick={handleOpen}
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
        <DialogBody className="overflow-y-scroll pr-2">
          <div className="mb-6">
            <Typography
              variant="small"
              color="gray"
              className="font-semibold opacity-70"
            >
              Popular
            </Typography>
            <ul className="mt-1 -ml-2 flex flex-col gap-1">
              {solanaWallets
                .filter((item) => item.readyState === "Installed")
                .map((wallet) => (
                  <MenuItem
                    key={wallet?.adapter?.name}
                    className="flex items-center gap-3"
                    onClick={() => solanaSelect(wallet?.adapter?.name)}
                  >
                    <img
                      src={wallet?.adapter?.icon}
                      alt={wallet?.adapter?.name}
                      className="h-6 w-6"
                    />
                    <Typography color="blue-gray" variant="h6">
                      {solanaWallet?.adapter?.name === wallet?.adapter?.name &&
                      solanaConnecting
                        ? "Connecting..."
                        : wallet?.adapter?.name}
                    </Typography>
                  </MenuItem>
                ))}
            </ul>
          </div>
        </DialogBody>
        <DialogFooter className="justify-between gap-2 border-t border-blue-gray-50">
          <Typography variant="small" color="gray" className="font-normal">
            New to Solana wallets?
          </Typography>
          <Button variant="text" size="sm">
            Learn More
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default SolanaWallets;
