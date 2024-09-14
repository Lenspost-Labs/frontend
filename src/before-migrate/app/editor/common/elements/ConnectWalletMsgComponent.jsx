import React from "react";
import Lottie from "lottie-react"; 
import animationData from "../../../../assets/lottie/walletAnimation.json";

const ConnectWalletMsgComponent = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="text-center">
        {/* <p className="text-gray-500 text-sm mt-4">Please connect your wallet</p> */}
        <p className="text-gray-500 text-sm mt-4">
          {/* Added Animation */}
          <Lottie className="h-32 pb-2 sm:h-56" animationData={animationData} />
          Please connect your wallet
        </p>
      </div> 
    </div>
  ); 
};

export default ConnectWalletMsgComponent;
