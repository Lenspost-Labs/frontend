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

const MobileNavbar = () => {
  const { curOpenedPanel, setCurOpenedPanel, openBottomBar, setOpenBottomBar } =
    useContext(Context);

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

        <Dialog
          // size={Number(window && window?.innerHeight - 100) || 0}
          size="xl"
          open={openBottomBar}
          handler={() => setOpenBottomBar(!openBottomBar)}
        >
          <DialogBody className="w-full h-[72vh] mb-4">
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
            {curOpenedPanel === "mobPanelShare" && <MobileShareSection />}
          </DialogBody>
        </Dialog>
      </div>
    </>
  );
};

export default MobileNavbar;
