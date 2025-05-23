import { Button } from "@material-tailwind/react";
import React, { useContext } from "react";
import { EVMLogo } from "../../../../../../assets";
import usePrivyAuth from "../../../../../../hooks/privy-auth/usePrivyAuth";
import { Context } from "../../../../../../providers/context";

const EVMWallets = ({ className, title = "Login" }) => {
  const { login } = usePrivyAuth();
  const { actionType } = useContext(Context);

  return (
    <Button
      size="lg"
      color="black"
      className={`flex items-center justify-center gap-3 outline-none my-2 ${className}`}
      onClick={() => login()}
    >
      {title}
    </Button>
  );
};

export default EVMWallets;
