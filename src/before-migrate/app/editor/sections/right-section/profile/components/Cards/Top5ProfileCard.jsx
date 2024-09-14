import React from "react";
import LensLogo from "../../assets/svgs/LogoLens.svg";
import BiCopy from "@meronex/icons/bi/BiCopy";
import { addressCrop } from "../../../../../../../utils";

const Top5ProfileCard = ({ profileImg, profileName, profileAddress }) => {
  return (
    <>
      <div className="flex align-middle justify-center bg-indigo-50 w-80 p-2 mt-4 rounded-md cursor-pointer ml-2">
        <div className="">
          {" "}
          {profileImg !== "" ? (
            <img className="h-16 rounded-full" src={profileImg} alt="" />
          ) : (
            <div className="h-16 w-16 rounded-full text-6xl  bg-indigo-100 flex text-center align-middle justify-center">
              {profileName.slice(1, 2)}{" "}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <div className="flex">
            <div className="">
              {" "}
              <img className="h-6 m-1" src={LensLogo} alt="" />{" "}
            </div>
            <div className="mt-2">{profileName}</div>
          </div>

          <div className="flex w-fit mt-2 ml-4 mr-4 bg-indigo-100  p-1 pl-2 pr-2 rounded-md">
            {/* {profileAddress.slice(0, 8)}........{profileAddress.slice(-4)}
            {/* <BiCopy className="ml-1 mt-0.5 " /> */}

            {addressCrop(profileAddress)}
          </div>
        </div>
      </div>
    </>
  );
};

export default Top5ProfileCard;
