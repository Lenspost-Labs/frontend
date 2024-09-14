import React from "react";
import { errorMessage } from "../../../../utils/errorMessage";
import Lottie from "lottie-react";
// import animationData from "../../../../assets/lottie/emptystates/emptyState2.json";

const ErrorComponent = ({ error }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* <Lottie animationData={animationData}/> */}
      <div className="text-center">
        <p className="text-gray-500 text-sm mt-4">{errorMessage(error)}</p>
      </div>
    </div>
  );
};

export default ErrorComponent;
