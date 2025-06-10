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
import BgRemover from "../bg-remover/BgRemover";
import MdcImagePlus from "@meronex/icons/mdc/MdcImagePlus";
import FiType from "@meronex/icons/fi/FiType";
import MdcStickerEmoji from "@meronex/icons/mdc/MdcStickerEmoji";
import MdcPencil from "@meronex/icons/mdc/MdcPencil";
import { ShareSection } from "../../right-section";
import { DesignPanel } from "../../left-section/design/DesignSection";
import clsx from "clsx";
import { motion, AnimatePresence } from "motion/react";
import HiOutlineSparkles from "@meronex/icons/hi/HiOutlineSparkles";
import { Button } from "@material-tailwind/react";

const MobileBottombar = () => {
  const {
    curOpenedPanel,
    setCurOpenedPanel,
    openBottomBar,
    setOpenBottomBar,
    curOpenedTabLevel1,
    setMenu,
    setIsShareOpen,
    setCurOpenedTabLevel1,
  } = useContext(Context);
  const store = useStore();
  const [showOptions, setShowOptions] = useState(false);

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

  const myFilesTabsData = [
    {
      label: "My Files",
      value: "my files",
      desc: <DesignPanel />,
    },
  ];

  // useEffect(() => {
  //   console.log(store?.openedSidePanel);

  //   if (store?.openedSidePanel === "effects") {
  //     setCurOpenedPanel("mobPanelEffects");
  //     setOpenBottomBar(true);
  //   }
  // }, [store?.openedSidePanel, store]);

  return (
    <>
      {showOptions && (
        <motion.div layoutId="tools" className="flex justify-between w-full">
          <BgRemover />

          <Button
            onClick={() => {
              fnOpenPanel("mobPanelUpload");
              setCurOpenedTabLevel1("ai");
            }}
            className="p-2 !py-0 mr-4 text-black leading-0 bg-[#e1f16b] rounded-lg"
          >
            <HiOutlineSparkles size={20} />
          </Button>
        </motion.div>
      )}
      <div className={clsx(showOptions ? "bg-[#F8F8F8]" : "")}>
        <div className="flex justify-between align-middle mx-6 my-2 z-[999999]">
          <AnimatePresence mode="wait">
            {!showOptions ? (
              <motion.div
                key="collapsed"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex justify-end w-full"
              >
                <motion.div layoutId="tools" className="flex justify-between w-full">
                  <BgRemover />

                  <Button
                    onClick={() => {
                      fnOpenPanel("mobPanelUpload");
                      setCurOpenedTabLevel1("ai");
                    }}
                    className="p-2 !py-0 mr-4 text-black leading-0 bg-[#e1f16b] rounded-lg"
                  >
                    <HiOutlineSparkles size={20} />
                  </Button>
                </motion.div>
                <div
                  onClick={() => setShowOptions(true)}
                  className="p-3 rounded-full bg-[#e1f16b] hover:bg-[#c7d36a] cursor-pointer transition-colors shadow-lg"
                >
                  <MdcPencil size={20} className="text-black" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex justify-between items-center w-full"
              >
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                  onClick={() => {
                    fnOpenPanel("mobPanelUpload");
                  }}
                  className={`${
                    curOpenedPanel === "mobPanelUpload" ? "bg-[#e1f16b]" : ""
                  } p-1 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors`}
                >
                  <MdcImagePlus size={24} />
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.15, duration: 0.3 }}
                  onClick={() => {
                    fnOpenPanel("mobPanelText");
                  }}
                  className={`${
                    curOpenedPanel === "mobPanelText" ? "bg-[#e1f16b]" : ""
                  } p-1 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors`}
                >
                  <FiType size={24} />
                </motion.div>
                <motion.div
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  onClick={() => {
                    fnOpenPanel("mobPanelStickers");
                  }}
                  className={`${
                    curOpenedPanel === "mobPanelStickers" ? "bg-[#e1f16b]" : ""
                  } p-1 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors`}
                >
                  <MdcStickerEmoji size={24} />
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25, duration: 0.3 }}
                >
                  <ShareButton />
                </motion.div>
                <motion.div
                  initial={{ x: 10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.3 }}
                  onClick={() => setShowOptions(false)}
                  className="p-1 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <BsX size={24} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* <div
						onClick={() => {
							//  	setOpenBottomBar(false)
							//fnOpenPanel('mobPanelShare')
							// setOpenBottomBar(!openBottomBar);
							// setMenu("share");
							// setIsShareOpen(true);
							setOpenBottomBar(true)
							//fnOpenPanel('mobPanelShare')
							setCurOpenedPanel('mobPanelShare')
						}}
						className={`${curOpenedPanel === 'mobPanelShare' ? 'bg-[#e1f16b]' : ''} p-1 rounded-lg`}
					>
						<Share2 size={24} />
					</div> */}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: showOptions ? 0.4 : 0.2, duration: 0.3 }}
          className="mx-6 mb-4"
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsShareOpen(true);
              setMenu("share");
            }}
            className="w-full bg-[#e1f16b] hover:bg-[#c7d36a] text-black font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg"
          >
            Cast
          </button>
          <span className="hidden">
            <ShareButton />
          </span>
        </motion.div>

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
                  <Tabs value={curOpenedTabLevel1 || "upload"}>
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

              {curOpenedPanel == "mobPanelMyFiles" && (
                <>
                  <Tabs value={curOpenedTabLevel1 || "my files"}>
                    <div className="flex gap-2 items-center">
                      <div className="w-full">
                        <TabsHeader>
                          {myFilesTabsData.map(({ label, value }) => (
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
                      {myFilesTabsData.map(({ value, desc }) => (
                        <TabPanel key={value} value={value}>
                          {desc}
                        </TabPanel>
                      ))}
                    </TabsBody>
                  </Tabs>
                </>
              )}

              {/* {curOpenedPanel === 'mobPanelShare' && <ShareSection />} */}

              {curOpenedPanel === "mobPanelEffects" && <>Effects</>}
            </>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileBottombar;
