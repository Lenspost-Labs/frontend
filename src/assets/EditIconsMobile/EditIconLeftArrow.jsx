import React from "react";

const EditIconLeftArrow = ({
  width = 18,
  height = 18,
  stroke = "#1C274C",
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6.75 3.75L11.25 9L6.75 14.25"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EditIconLeftArrow;
