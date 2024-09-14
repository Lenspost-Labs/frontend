import { Button } from "@material-tailwind/react";
import { useLogin } from "@privy-io/react-auth";
import React from "react";
import { EVMLogo } from "../../../../../../assets";
import { evmAuth } from "../../../../../../services";
import { useMutation } from "@tanstack/react-query";

const EVMWallets = ({ title, className , login }) => {
  // set login with hooks for priv

  return (
    <Button
      size="lg"
      color="black"
      className={`flex items-center justify-center gap-3 outline-none my-2 ${className}`}
      onClick={login}
    >
      <img
        src={EVMLogo}
        alt="evm"
        className="h-6 w-6 object-contain bg-cover"
      />
      {title}
    </Button>
  );
};

export default EVMWallets;
