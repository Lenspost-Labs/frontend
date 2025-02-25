import { Button } from "@material-tailwind/react";
import React from "react";
import { EVMLogo } from "../../../../../../assets";
import usePrivyAuth from "../../../../../../hooks/privy-auth/usePrivyAuth";

const EVMWallets = ({ className }) => {
  const { login } = usePrivyAuth();

  return (
    <Button
      size="lg"
      color="black"
      className={`flex items-center justify-center gap-3 outline-none my-2 ${className}`}
      onClick={() => login()}
    >
      Login
    </Button>
  );
};

export default EVMWallets;
