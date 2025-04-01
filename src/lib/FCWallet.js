import { connect } from "wagmi/actions";
import { config } from "../providers/EVM/EVMWalletProvider";
import farcasterFrame from "@farcaster/frame-wagmi-connector";

// connect FC wallet
export const connectFCWallet = () => {
  connect(config, { connector: farcasterFrame() });
};
