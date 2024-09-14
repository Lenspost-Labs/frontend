import React from "react";

const CardsHeading = ({ name, icon, iconImg, onClickFn }) => {
  return (
    <>
      <div className="flex ml-4 ">
        <div className="text-base font-semibold">{name}</div>
        <div className="pl-2">
          {" "}
          {iconImg && <img className=" h-5" src={iconImg} alt="" />}
          <div className="mt-1">{icon && icon} </div>
        </div>
      </div>
    </>
  );
};

export default CardsHeading;
