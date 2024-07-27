import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../../../providers/context";
import EditIconShare from "../../../../../assets/EditIconsMobile/EditIconShare";
import EditIconStickers from "../../../../../assets/EditIconsMobile/EditIconStickers";
import EditIconText from "../../../../../assets/EditIconsMobile/EditIconText";
import EditIconUpload from "../../../../../assets/EditIconsMobile/EditIconUpload";
import { Drawer } from "@material-tailwind/react";
import UploadSection, {
  UploadPanel,
} from "../../left-section/upload/UploadSection";
import { TextSection } from "polotno/side-panel";

const MobileNavbar = () => {
  const { curOpenedPanel, setCurOpenedPanel, openBottomBar, setOpenBottomBar } =
    useContext(Context);

  return (
    <>
      <div className="bg-[#F8F8F8]">
        <div className="flex justify-between align-middle mx-6 my-2">
          <div
            onClick={() => {
              setCurOpenedPanel("mobPanelUpload");
              setOpenBottomBar(!openBottomBar);
            }}
            className={`${
              curOpenedPanel === "mobPanelUpload" ? "bg-[#e1f16b]" : ""
            } p-1 rounded-lg`}
          >
            <EditIconUpload />
          </div>
          <div
            onClick={() => {
              setCurOpenedPanel("mobPanelText");
              setOpenBottomBar(!openBottomBar);
            }}
            className={`${
              curOpenedPanel === "mobPanelText" ? "bg-[#e1f16b]" : ""
            } p-1 rounded-lg`}
          >
            <EditIconText />
          </div>
          <div
            onClick={() => {
              setCurOpenedPanel("mobPanelStickers");
              setOpenBottomBar(!openBottomBar);
            }}
            className={`${
              curOpenedPanel === "mobPanelStickers" ? "bg-[#e1f16b]" : ""
            } p-1 rounded-lg`}
          >
            <EditIconStickers />
          </div>
          <div
            onClick={() => {
              setCurOpenedPanel("mobPanelShare");
              setOpenBottomBar(!openBottomBar);
            }}
            className={`${
              curOpenedPanel === "mobPanelShare" ? "bg-[#e1f16b]" : ""
            } p-1 rounded-lg`}
          >
            <EditIconShare />
          </div>
        </div>

        <Drawer
          size={Number(window && window?.innerHeight - 100) || 0}
          placement="bottom"
          open={openBottomBar}
          onClose={() => setOpenBottomBar(!openBottomBar)}
          className=""
        >
          {curOpenedPanel === "mobPanelUpload" && (
            <>
              <UploadPanel />
            </>
          )}

          {/* {curOpenedPanel === "mobPanelText" && <>{TextSection.Panel()}</>} */}
        </Drawer>
      </div>
    </>
  );
};

export default MobileNavbar;
