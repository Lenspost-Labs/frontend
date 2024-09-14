import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { EVMWallets, SolanaWallets } from "./wallets";
import usePrivyAuth from "../../../../../hooks/privy-auth/usePrivyAuth";

const LoginBtn = () => {
  const { login } = usePrivyAuth();
  return (
    <>
      <Typography variant="h5" color="blue-gray">
        Login with
      </Typography>

      <SolanaWallets />

      <EVMWallets login={login} />
    </>
  );
};

export default LoginBtn;
