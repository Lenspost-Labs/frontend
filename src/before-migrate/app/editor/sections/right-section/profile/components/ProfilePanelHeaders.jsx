// --------
// This is the Top Profile Panel Header component, just pass in:
// panelHeader - the Name to be displayed, prevMenu - name that's used to go back to the previous menu, panelContent - the content to be displayed
// --------
import React, { useContext, useState } from "react";
import BsArrowLeft from "@meronex/icons/bs/BsArrowLeft";
import BsX from "@meronex/icons/bs/BsX";
import { Context } from "../../../../../../providers/context";

const ProfilePanelHeaders = ({ panelHeader, prevMenu, panelContent }) => {
  const { setMenu, setIsProfileOpen, } = useContext(Context);

  return (
    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-2xl rounded-lg rounded-r-none ">
      <div className="">
        {/* <Dialog.Title className="w-full flex items-center gap-2 text-white text-xl leading-6 p-6 fixed bg-gray-900 z-10"> */}
        {/* <div className="bg-gradient-to-b from-teal-100 via-transparent to-gray-100"> */}
          <div className="w-full flex justify-between items-center gap-2 bg-black text-white text-xl leading-6 p-4  rounded-lg rounded-r-none">
            {prevMenu && (
              <BsArrowLeft
                onClick={() => setMenu(`${prevMenu}`)}
                className="cursor-pointer"
              />
            )}
            {!prevMenu && <div> {""}</div>}

            {panelHeader}
            {/* </Dialog.Title> */}
            <div
              className="z-100 cursor-pointer"
              onClick={() => {
                setIsProfileOpen(false);
                setMenu("");
              }}
            >
              <BsX size="24" />
            </div>
          </div>
        </div>
      {/* </div> */}

      {panelContent}
    </div>
  );
};

export default ProfilePanelHeaders;
