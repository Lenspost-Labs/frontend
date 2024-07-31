import React from "react";

const Logo = ({ propWidth, propHeight }) => {
  return (
    <div className="flex items-center justify-between cursor-pointer w-[40%] sm:w-[20%] lg:w-[10%]">
      <img
        width={propWidth}
        height={propHeight}
        className="flex items-center justify-start object-contain px-2"
        src="/logo-trans-bg.svg"
        alt="lenspost"
      />
    </div>
  );
};

export default Logo;
