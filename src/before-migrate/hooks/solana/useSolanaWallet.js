import { useWallet } from "@solana/wallet-adapter-react";

const useSolanaWallet = () => {
  const {
    autoConnect,
    connect,
    connected,
    connecting,
    disconnect,
    disconnecting,
    publicKey,
    select,
    sendTransaction,
    signAllTransactions,
    signIn,
    signMessage,
    signTransaction,
    wallet,
    wallets,
  } = useWallet();

  return {
    solanaAutoConnect: autoConnect,
    solanaConnect: connect,
    solanaConnected: connected,
    solanaConnecting: connecting,
    solanaDisconnect: disconnect,
    solanaDisconnecting: disconnecting,
    solanaAddress: publicKey?.toBase58(),
    solanaPublicKey: publicKey,
    solanaSelect: select,
    solanaSendTransaction: sendTransaction,
    solanaSignAllTransactions: signAllTransactions,
    solanaSignIn: signIn,
    solanaSignMessage: signMessage,
    solanaSignTransaction: signTransaction,
    solanaWallet: wallet,
    solanaWallets: wallets,
  };
};

export default useSolanaWallet;
