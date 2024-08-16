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
import {
  LenspostNFT,
  RenderCategories,
} from "../../left-section/nft/NFTSection";
import MobileShareSection from "../../right-section/share/MobileShareUI/MobileShareSection";
import ShareButton from "../../top-section/share/ShareButton";
import BsX from "@meronex/icons/bs/BsX";
import useMobilePanelFunctions from "../../../common/mobileHooks/useMobilePanelFunctions";
import { CustomTextPanel } from "../../left-section/text/TextSection";

const MobileBottombar = () => {
  const {
    curOpenedPanel,
    setCurOpenedPanel,
    openBottomBar,
    setOpenBottomBar,
    curOpenedTabLevel1,
    setCurOpenedTabLevel1,
    curOpenedTabLevel2,
    setCurOpenedTabLevel2,
  } = useContext(Context);
  const store = useStore();

  const { fnOpenPanel } = useMobilePanelFunctions();

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setOpenBottomBar(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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
      desc: <LenspostNFT />,
    },
  ];

  return (
    <>
      <div className="bg-[#F8F8F8]">
        <div className="flex justify-between align-middle mx-6 my-2 z-[999999]">
          <div
            onClick={() => {
              // setOpenBottomBar(!openBottomBar);
              // setCurOpenedPanel("mobPanelUpload");
              fnOpenPanel("mobPanelUpload");
            }}
            className={`${
              curOpenedPanel === "mobPanelUpload" ? "bg-[#e1f16b]" : ""
            } p-1 rounded-lg`}
          >
            <EditIconUpload />
          </div>
          <div
            onClick={() => {
              // setCurOpenedPanel("mobPanelText");
              // setOpenBottomBar(!openBottomBar);
              fnOpenPanel("mobPanelText");
            }}
            className={`${
              curOpenedPanel === "mobPanelText" ? "bg-[#e1f16b]" : ""
            } p-1 rounded-lg`}
          >
            <EditIconText />
          </div>
          <div
            onClick={() => {
              // setCurOpenedPanel("mobPanelStickers");
              // setOpenBottomBar(!openBottomBar);
              fnOpenPanel("mobPanelStickers");
            }}
            className={`${
              curOpenedPanel === "mobPanelStickers" ? "bg-[#e1f16b]" : ""
            } p-1 rounded-lg`}
          >
            <EditIconStickers />
          </div>
          <div
            onClick={() => {
              setOpenBottomBar(false);
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

        {/* Custom Drawer for Bottom Bar - Pure tailwind CSS only */}
        <div
          // on escape press
          className={`fixed ${
            openBottomBar ? "bottom-16" : "bottom-0"
          } h-[calc(100vh-6rem)] z-[999] overflow-y-auto left-0 right-0 bg-white transition-transform duration-300 ease-in-out ${
            openBottomBar ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="p-4">
            <>
              <div className="flex align-middle justify-end p-4 pt-2"></div>
              {curOpenedPanel === "mobPanelUpload" && (
                <>
                  <Tabs value="upload">
                    <div className="flex gap-2 items-center">
                      <div className="w-full">
                        <TabsHeader>
                          {uploadTabsData.map(({ label, value }) => (
                            <Tab key={value} value={value}>
                              {label}
                            </Tab>
                          ))}
                        </TabsHeader>
                      </div>
                      <div className="bg-[#f8f8f8] rounded-full p-1">
                        <BsX
                          className="cursor-pointer text-blue-gray-600"
                          size={32}
                          onClick={() => {
                            setOpenBottomBar(false);
                            setCurOpenedPanel(null);
                          }}
                        />
                      </div>
                    </div>
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
              {curOpenedPanel === "mobPanelText" && (
                // <div className="" onClick={() => setOpenBottomBar(false)}>
                //   {TextSection.Panel({ store })}
                // </div>
                <>
                  <CustomTextPanel />
                </>
              )}

              {curOpenedPanel === "mobPanelStickers" && (
                <>
                  <Tabs value={curOpenedTabLevel1 || "stickers"}>
                    <div className="flex gap-2 items-center">
                      <div className="w-full">
                        <TabsHeader>
                          {stickersTabsData.map(({ label, value }) => (
                            <Tab key={value} value={value}>
                              {label}
                            </Tab>
                          ))}
                        </TabsHeader>
                      </div>
                      <div className="bg-[#f8f8f8] rounded-full p-1">
                        <BsX
                          className="cursor-pointer text-blue-gray-600"
                          size={32}
                          onClick={() => {
                            setOpenBottomBar(false);
                            setCurOpenedPanel(null);
                          }}
                        />
                      </div>
                    </div>
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
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileBottombar;
