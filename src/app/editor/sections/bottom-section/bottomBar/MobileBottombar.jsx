import React, { useContext, useEffect, useState } from "react";
import { Context } from "../../../../../providers/context";
import EditIconShare from "../../../../../assets/EditIconsMobile/EditIconShare";
import EditIconStickers from "../../../../../assets/EditIconsMobile/EditIconStickers";
import EditIconText from "../../../../../assets/EditIconsMobile/EditIconText";
import EditIconUpload from "../../../../../assets/EditIconsMobile/EditIconUpload";
import {
  Dialog,
  DialogBody,
  DialogHeader,
  Drawer,
  Tab,
  TabPanel,
  Tabs,
  TabsBody,
  TabsHeader,
} from "@material-tailwind/react";
import UploadSection, {
  UploadPanel,
} from "../../left-section/upload/UploadSection";
import { TextSection } from "polotno/side-panel";
import { useStore } from "../../../../../hooks/polotno";
import { CompSearch } from "../../left-section/image/AIImageSection";
import { LenspostTemplates } from "../../left-section/template/TemplateSection";
import { StickerPanel } from "../../left-section/sticker/StickerSection";
import { MemePanel } from "../../left-section/meme/MemeSection";
import { RenderCategories } from "../../left-section/nft/NFTSection";
import MobileShareSection from "../../right-section/share/MobileShareUI/MobileShareSection";
import ShareButton from "../../top-section/share/ShareButton";
import BsX from "@meronex/icons/bs/BsX";

const MobileBottombar = () => {
  const {
    curOpenedPanel,
    setCurOpenedPanel,
    openBottomBar,
    setOpenBottomBar,
    setMenu,
    setIsShareOpen,
  } = useContext(Context);

  const store = useStore();

  const uploadTabsData = [
    {
      label: "Upload",
      value: "upload",
      desc: <UploadPanel />,
    },
    {
      label: "AI",
      value: "ai",
      desc: <CompSearch />,
    },
    {
      label: "Templates",
      value: "templates",
      desc: <LenspostTemplates />,
    },
  ];

  const stickersTabsData = [
    {
      label: "Stickers",
      value: "stickers",
      desc: <StickerPanel />,
    },
    {
      label: "Memes",
      value: "memes",
      desc: <MemePanel />,
    },
    {
      label: "CC0",
      value: "cc0",
      desc: <RenderCategories />,
    },
  ];

  return (
    <>
      <div className="bg-[#F8F8F8]">
        <div className="flex justify-between align-middle mx-6 my-2 z-[10000]">
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
              // setOpenBottomBar(!openBottomBar);
              // setMenu("share");
              // setIsShareOpen(true);
            }}
            className={`${
              curOpenedPanel === "mobPanelShare" ? "bg-[#e1f16b]" : ""
            } p-1 rounded-lg`}
          >
            <ShareButton />
          </div>
        </div>

        <Drawer
          placement="top"
          className={`${
            openBottomBar === false
              ? "min-h-[calc(0vh)] max-h-[calc(0vh)] overflow-y-auto"
              : `min-h-[calc(100vh-5rem)] max-h-[calc(100vh-5rem)] overflow-y-auto`
          }`}
          open={openBottomBar}
          onClose={() => setOpenBottomBar(!openBottomBar)}
          // handler={() => setOpenBottomBar(!openBottomBar)}
        >
          <>
            {/* <DialogBody className=""> */}
            <div className="flex align-middle justify-end p-4 pt-2">
              <BsX
                className="cursor-pointer bg-[#f8f8f8] rounded-lg"
                size={24}
                onClick={() => setOpenBottomBar(!openBottomBar)}
              />
            </div>
            {curOpenedPanel === "mobPanelUpload" && (
              <>
                <Tabs value="upload">
                  <TabsHeader>
                    {uploadTabsData.map(({ label, value }) => (
                      <Tab key={value} value={value}>
                        {label}
                      </Tab>
                    ))}
                  </TabsHeader>
                  <TabsBody>
                    {uploadTabsData.map(({ value, desc }) => (
                      <TabPanel key={value} value={value}>
                        {desc}
                      </TabPanel>
                    ))}
                  </TabsBody>
                </Tabs>
              </>
            )}
            {curOpenedPanel === "mobPanelText" && TextSection.Panel({ store })}

            {curOpenedPanel === "mobPanelStickers" && (
              <>
                <Tabs value="stickers">
                  <TabsHeader>
                    {stickersTabsData.map(({ label, value }) => (
                      <Tab key={value} value={value}>
                        {label}
                      </Tab>
                    ))}
                  </TabsHeader>
                  <TabsBody>
                    {stickersTabsData.map(({ value, desc }) => (
                      <TabPanel key={value} value={value}>
                        {desc}
                      </TabPanel>
                    ))}
                  </TabsBody>
                </Tabs>
              </>
            )}
            {/* {curOpenedPanel === "mobPanelShare" && <MobileShareSection />} */}
            {/* </DialogBody> */}
          </>{" "}
        </Drawer>
      </div>
    </>
  );
};

export default MobileBottombar;
