import React from "react";

const EditIconUpload = ({
  width = 32,
  height = 32,
  stroke = "#1C274C",
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 20C4 23.7712 4 25.6568 5.17157 26.8284C6.34315 28 8.22876 28 12 28H20C23.7712 28 25.6568 28 26.8284 26.8284C28 25.6568 28 23.7712 28 20"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16 21.3333V4M16 4L21.3334 9.83333M16 4L10.6667 9.83333"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EditIconUpload;
