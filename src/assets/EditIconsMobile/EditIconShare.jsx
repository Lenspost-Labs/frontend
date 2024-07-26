import React from "react";

const EditIconShare = ({
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
        d="M29.3334 18.6639C29.2949 23.2159 29.0421 25.7253 27.3873 27.3803C25.4341 29.3333 22.2906 29.3333 16.0035 29.3333C9.71652 29.3333 6.57301 29.3333 4.61988 27.3803C2.66675 25.4271 2.66675 22.2836 2.66675 15.9965C2.66675 9.70948 2.66675 6.56596 4.61988 4.61283C6.27473 2.95796 8.78417 2.70526 13.3362 2.66666"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M29.3333 9.33332H18.6667C16.2432 9.33332 14.7823 10.5227 14.2405 11.067C14.0728 11.2356 13.9889 11.3199 13.9877 11.3211C13.9867 11.3222 13.9023 11.4061 13.7337 11.5739C13.1894 12.1156 12 13.5765 12 16V20M29.3333 9.33332L22.6667 2.66666M29.3333 9.33332L22.6667 16"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EditIconShare;
