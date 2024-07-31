import React, { useState } from "react";

const EditIconAI = ({
  width = 40,
  height = 40,
  stroke = "#1C274C",
  strokeWidth = 1.5,
  needAnimation = false,
}) => {
  const [animation, setAnimation] = useState(needAnimation);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={animation ? "animate-icon" : ""}
      style={{
        animation: animation ? "wiggle 0.5s ease-in-out" : "none",
      }}
    >
      <path
        d="M13.389 6.0964C13.9655 4.63453 16.0345 4.63453 16.611 6.09641L18.3977 10.6266C18.5737 11.073 18.927 11.4263 19.3733 11.6023L23.9037 13.389C25.3655 13.9655 25.3655 16.0345 23.9037 16.611L19.3733 18.3977C18.927 18.5737 18.5737 18.927 18.3977 19.3733L16.611 23.9037C16.0344 25.3655 13.9655 25.3655 13.389 23.9037L11.6023 19.3733C11.4262 18.927 11.073 18.5737 10.6266 18.3977L6.0964 16.611C4.63453 16.0344 4.63453 13.9655 6.09641 13.389L10.6266 11.6023C11.073 11.4262 11.4263 11.073 11.6023 10.6266L13.389 6.0964Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <path
        opacity="0.4"
        d="M27.4809 22.2468C27.7859 21.4733 28.8809 21.4733 29.1859 22.2468L30.5202 25.6302C30.6134 25.8663 30.8004 26.0533 31.0365 26.1465L34.4199 27.4808C35.1934 27.7858 35.1934 28.8808 34.4199 29.1858L31.0365 30.5202C30.8004 30.6133 30.6134 30.8003 30.5202 31.0365L29.1859 34.4198C28.8809 35.1933 27.7859 35.1933 27.4809 34.4198L26.1465 31.0365C26.0534 30.8003 25.8664 30.6133 25.6302 30.5202L22.2469 29.1858C21.4734 28.8808 21.4734 27.7858 22.2469 27.4808L25.6302 26.1465C25.8664 26.0533 26.0534 25.8663 26.1465 25.6302L27.4809 22.2468Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      <style jsx>{`
        @keyframes wiggle {
          0%,
          100% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(5deg);
          }
          75% {
            transform: rotate(-5deg);
          }
        }
        .animate-icon {
          animation: wiggle 0.5s ease-in-out;
        }
      `}</style>
    </svg>
  );
};

export default EditIconAI;
