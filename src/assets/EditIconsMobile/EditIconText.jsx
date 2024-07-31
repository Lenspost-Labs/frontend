import React from "react";

const EditIconText = ({
  width = 33,
  height = 32,
  stroke = "#1C274C",
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 33 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.5"
        d="M28.3333 12.4C28.2565 9.05049 27.9359 7.09408 26.5965 5.75736C24.8357 4 22.0015 4 16.3333 4C10.665 4 7.83089 4 6.07 5.75736C4.73059 7.09408 4.40999 9.05049 4.33325 12.4M28.3333 19.6C28.2565 22.9495 27.9359 24.9059 26.5965 26.2427C24.8357 28 22.0015 28 16.3333 28C10.665 28 7.83089 28 6.07 26.2427C4.7306 24.9059 4.41 22.9495 4.33325 19.6"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M11 10.6667H21.6667"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M16.3333 21.3333V10.6667"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M29.6667 16H27"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M5.66667 16H3"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default EditIconText;
