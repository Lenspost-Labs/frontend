import React from "react";

import Lottie from "lottie-react";
import animationData from "../../../../assets/lottie/loaders/loadingAnimation.json";
// import animationData from "../../../../assets/lottie/loaders/loadingAnimation3.json"

const LoadingAnimatedComponent = () => {
  return (
    <>
      <Lottie animationData={animationData} />
    </>
  );
};
export default LoadingAnimatedComponent;
