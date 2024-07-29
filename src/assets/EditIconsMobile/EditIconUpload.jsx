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
        opacity="0.5"
        d="M22.6667 12.0026C25.5667 12.0187 27.1373 12.1473 28.1618 13.1719C29.3334 14.3435 29.3334 16.2291 29.3334 20.0003V21.3336C29.3334 25.1048 29.3334 26.9905 28.1618 28.162C26.9902 29.3336 25.1046 29.3336 21.3334 29.3336H10.6667C6.89551 29.3336 5.00989 29.3336 3.83832 28.162C2.66675 26.9905 2.66675 25.1048 2.66675 21.3336V20.0003C2.66675 16.2291 2.66675 14.3435 3.83832 13.1718C4.86283 12.1473 6.43337 12.0187 9.33341 12.0026"
        stroke={stroke}
        stroke-width={strokeWidth}
        stroke-linecap="round"
      />
      <path
        d="M16 20V2.66666M16 2.66666L20 7.33332M16 2.66666L12 7.33332"
        stroke={stroke}
        stroke-width={strokeWidth}
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default EditIconUpload;
