import React from "react";

const EditIconStickers = ({
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
        d="M12.6667 21.3333C13.8006 22.1737 15.1795 22.6667 16.6667 22.6667C18.1539 22.6667 19.5329 22.1737 20.6667 21.3333"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M20.6668 16C21.4032 16 22.0002 15.1046 22.0002 14C22.0002 12.8954 21.4032 12 20.6668 12C19.9305 12 19.3335 12.8954 19.3335 14C19.3335 15.1046 19.9305 16 20.6668 16Z"
        fill={stroke}
      />
      <path
        d="M12.6668 16C13.4032 16 14.0002 15.1046 14.0002 14C14.0002 12.8954 13.4032 12 12.6668 12C11.9304 12 11.3335 12.8954 11.3335 14C11.3335 15.1046 11.9304 16 12.6668 16Z"
        fill={stroke}
      />
      <path
        opacity="0.5"
        d="M30.0002 18.6667C30.0002 23.6949 30.0002 26.2092 28.438 27.7712C26.876 29.3333 24.3618 29.3333 19.3335 29.3333"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        opacity="0.5"
        d="M14.0002 29.3333C8.97184 29.3333 6.4577 29.3333 4.89559 27.7712C3.3335 26.2092 3.3335 23.6949 3.3335 18.6667"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        opacity="0.5"
        d="M14.0002 2.66666C8.97184 2.66666 6.4577 2.66666 4.89559 4.22875C3.3335 5.79086 3.3335 8.305 3.3335 13.3333"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        opacity="0.5"
        d="M19.3335 2.66666C24.3618 2.66666 26.876 2.66666 28.438 4.22875C30.0002 5.79086 30.0002 8.305 30.0002 13.3333"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default EditIconStickers;
