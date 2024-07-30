import React from "react";

const Logo = () => {
  return (
    <div className="flex items-center justify-between cursor-pointer w-[40%] sm:w-[20%] lg:w-[10%]">
      <img
        className="flex items-center justify-start object-contain h-20"
        src="/logo-trans-bg.svg"
        alt="lenspost"
      />
    </div>
  );
};

export default Logo;
