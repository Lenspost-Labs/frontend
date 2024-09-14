import React from "react";

const EditIconHome = ({
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
        d="M2.66663 16.2719C2.66663 13.2206 2.66663 11.695 3.35889 10.4303C4.05116 9.1656 5.31589 8.38067 7.84533 6.81083L10.512 5.15582C13.1858 3.49638 14.5228 2.66666 16 2.66666C17.4772 2.66666 18.8141 3.49638 21.488 5.15582L24.1546 6.81082C26.6841 8.38067 27.9488 9.1656 28.641 10.4303C29.3333 11.695 29.3333 13.2206 29.3333 16.2719V18.3C29.3333 23.5011 29.3333 26.1017 27.7712 27.7175C26.2092 29.3333 23.6949 29.3333 18.6666 29.3333H13.3333C8.30497 29.3333 5.79083 29.3333 4.22872 27.7175C2.66663 26.1017 2.66663 23.5011 2.66663 18.3V16.2719Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <path
        d="M20 24H12"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
};

export default EditIconHome;
