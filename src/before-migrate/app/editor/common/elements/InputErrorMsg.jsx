import React from "react";

const InputErrorMsg = ({ message, className }) => {
  return (
    <p className={`text-red-500 font-semibold italic ${className}`}>
      {message}
    </p>
  );
};

export default InputErrorMsg;
