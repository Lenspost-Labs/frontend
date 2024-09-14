import React from "react";

const EditIconLeft = ({
  width = 33,
  height = 33,
  stroke = "#1C274C",
  strokeWidth = 1.5,
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.942 30.2754C24.3058 30.2754 30.2753 24.3058 30.2753 16.942C30.2753 9.57823 24.3058 3.6087 16.942 3.6087C9.57821 3.6087 3.60867 9.57823 3.60867 16.942C3.60867 24.3058 9.57821 30.2754 16.942 30.2754Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <path
        d="M18.942 12.942L14.942 16.942L18.942 20.942"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EditIconLeft;
