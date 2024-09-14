import React from "react";

const EditIconRight = ({
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
        d="M16 29.3333C23.3638 29.3333 29.3333 23.3638 29.3333 16C29.3333 8.63619 23.3638 2.66666 16 2.66666C8.63619 2.66666 2.66666 8.63619 2.66666 16C2.66666 23.3638 8.63619 29.3333 16 29.3333Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <path
        d="M14 12L18 16L14 20"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EditIconRight;
