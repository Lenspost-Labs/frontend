import Toolbar from "polotno/toolbar/toolbar";
import React, { useContext, useEffect } from "react";
import { useStore } from "../../../../../hooks/polotno";
import EditIconLeft from "../../../../../assets/EditIconsMobile/EditIconLeft";
import { Context } from "../../../../../providers/context";
import { Button, Drawer } from "@material-tailwind/react";
import EditIconRight from "../../../../../assets/EditIconsMobile/EditIconRight";
import Logo from "../logo/Logo";
import EditIconRightArrow from "../../../../../assets/EditIconsMobile/EditIconRightArrow";
import EditIconHome from "../../../../../assets/EditIconsMobile/EditIconHome";
import EditIconMyFIles from "../../../../../assets/EditIconsMobile/EditIconMyFIles";
import EditIconAI from "../../../../../assets/EditIconsMobile/EditIconAI";
import { DesignPanel } from "../../left-section/design/DesignSection";
import { CompSearch } from "../../left-section/image/AIImageSection";
import {
  CompCarousel,
  CustomHorizontalScroller,
  CustomImageComponent,
} from "../../../common";
import { EVMWallets } from "../auth/wallets";
import { useAppAuth, useAppUrl } from "../../../../../hooks/app";
import { EVMLogo } from "../../../../../assets";
import PointsBtn from "../PointsBtn/PointsBtn";
import ImagesWithArrows from "../../../common/core/CustomsTabsWArrows/ImagesWithArrows";
import DownloadBtn from "../download/DownloadBtn";
import { useUser } from "../../../../../hooks/user";
import EditIconCreate from "../../../../../assets/EditIconsMobile/EditIconCreate";
import { useQuery } from "@tanstack/react-query";
import { apiGetAllMemes } from "../../../../../services";
import useMobilePanelFunctions from "../../../common/mobileHooks/useMobilePanelFunctions";
import coinImg from "../../../../../assets/svgs/Coin.svg";
import BisMagicWand from "@meronex/icons/bi/BisMagicWand";
import BiHomeAlt from "@meronex/icons/bi/BiHomeAlt";
import MdcFolderSearchOutline from "@meronex/icons/mdc/MdcFolderSearchOutline";
import { toCapitalize } from "../../../../../utils";
import usePrivyAuth from "../../../../../hooks/privy-auth/usePrivyAuth";
import GiFairyWand from "@meronex/icons/gi/GiFairyWand";
import FaLaughSquint from "@meronex/icons/fa/FaLaughSquint";
import FaRobot from "@meronex/icons/fa/FaRobot";
import ZoCloudUpload from "@meronex/icons/zo/ZoCloudUpload";
import FaMehBlank from "@meronex/icons/fa/FaMehBlank";

const MobileTopbar = () => {
  const { urlQueryActionType } = useAppUrl();

  const store = useStore();
  const {
    openLeftBar,
    setOpenLeftBar,
    curOpenedPanel,
    setCurOpenedPanel,
    setIsProfileOpen,
    isProfileOpen,
    setMenu,
    openBottomBar,
    curOpenedTabLevel1,
    setCurOpenedTabLevel1,
    curOpenedTabLevel2,
    setCurOpenedTabLevel2,
  } = useContext(Context);
  const { login } = usePrivyAuth();
  const { isAuthenticated } = useAppAuth();
  const { points } = useUser();
  const { fnCloseLeftOpenEditorPanel } = useMobilePanelFunctions();

  const { data: memesData, error: memesError } = useQuery({
    queryKey: ["memesMob"],
    queryFn: () => apiGetAllMemes(),
  });

  const AIImagesMob = [
    "https://fal.media/files/monkey/cVoNvipRF_fUCUKcl7R-e.jpeg",
    "https://fal.media/files/monkey/riSVL2tWeSBIGatnuqgh7.jpeg",
    "https://fal.media/files/penguin/zgIytfvFc64PB77YJ8Wu3.jpeg",
    "https://fal.media/files/zebra/uHLqe_-pHJ0jQGi1AzbeD.jpeg",
    "https://fal.media/files/panda/bDddS2m9bojQ1jrl7EfI8.jpeg",
    "https://fal.media/files/koala/RUilq65w1LsE8IyALvB_p.jpeg",
  ];

  const memesAll = memesData?.data?.memes || [];
  let MemesMob = [];
  memesAll.map((meme, index) => {
    if (index < 10) {
      MemesMob.push(meme?.url);
    }
  });

  const stickersSections = [
    {
      author: "camp",
      campaign: "camp",
    },
    // {
    //   author: "$Pipe",
    //   campaign: "$Pipe",
    // },
    {
      author: "OwnTheDoge",
      campaign: "OwnTheDoge",
    },
    // {
    //   author: "MrMiggles",
    //   campaign: "MrMiggles",
    // },
    // {
    //   author: "BizarreBeasts",
    //   campaign: "BizarreBeasts",
    // },
    {
      author: "degen",
      campaign: "degen",
    },
  ];

  // const MemesMob = [
  //   "https://i.imgflip.com/30b1gx.jpg",
  //   "https://i.imgflip.com/1g8my4.jpg",
  //   "https://i.imgflip.com/1b42wl.jpg",
  //   "https://i.imgflip.com/28j0te.jpg",
  //   "https://i.imgflip.com/9ehk.jpg",
  //   "https://i.imgflip.com/2ybua0.png",
  //   "https://i.imgflip.com/1bhk.jpg",
  // ];

  // const stickersMob = [
  //   "https://lenspost.s3.ap-south-1.amazonaws.com/Stickers/phi/phi-229.png",
  //   "https://lenspost.s3.ap-south-1.amazonaws.com/Stickers/phi/phi-237.png",
  //   "https://lenspost.s3.ap-south-1.amazonaws.com/Stickers/phi/phi-242.png",
  //   "https://lenspost.s3.ap-south-1.amazonaws.com/Stickers/phi/phi-248.png",
  //   "https://lenspost.s3.ap-south-1.amazonaws.com/Stickers/phi/phi-252.png",
  // ];

  const actionBtns = [
    {
      name: "MEMES",
      icon: <FaLaughSquint size={20} />,
      action: () => {
        fnCloseLeftOpenEditorPanel("mobPanelStickers");
        setCurOpenedTabLevel1("memes");
      },
    },
    {
      name: "AI POSTER",
      icon: <FaRobot size={25} />,
      action: () => setCurOpenedPanel("mobPanelAI"),
    },
    {
      name: "UPLOAD MEDIA",
      icon: <ZoCloudUpload size={35} />,
      action: () => {
        setOpenLeftBar(!openLeftBar);
        fnCloseLeftOpenEditorPanel("mobPanelUpload");
        // fnOpenPanel("mobPanelUpload");
      },
    },
    {
      name: "BLANK CANVAS",
      icon: <FaMehBlank size={30} />,
      action: () => setOpenLeftBar(!openLeftBar),
    },
  ];

  // To open Home on Panel Open
  useEffect(() => {
    if (!openLeftBar && !openBottomBar) {
      setCurOpenedPanel("");
    }
    // To close Leftbar and open Bottombar - fnCloseLeftOpenEditorPanel
    if (!openLeftBar && openBottomBar) {
      return;
    } else {
      setCurOpenedPanel("mobPanelHome");
    }
  }, [openLeftBar, openBottomBar]);

  const { fnOpenPanel } = useMobilePanelFunctions();

  return (
    <>
      <div className="flex items-center gap-2 overflow-x-scroll">
        <div
          onClick={() => setOpenLeftBar(!openLeftBar)}
          className="bg-white p-2 rounded-lg"
        >
          <EditIconLeft />
        </div>
        <Toolbar store={store} />
        {urlQueryActionType !== "composer" && (
          <div className="bg-white rounded-lg p-3">
            <DownloadBtn />
          </div>
        )}
      </div>

      <Drawer
        size={Number(window && window?.innerWidth) || 0}
        placement="left"
        open={openLeftBar}
        onClose={() => setOpenLeftBar(!openLeftBar)}
        className=""
      >
        <div className="flex flex-col justify-between h-full overflow-x-auto">
          {/* Top bar for Home page */}
          <div className="flex justify-between items-center m-2 border-b-2 pb-4 rounded-xl shadow-sm">
            <Logo propHeight={30} />

            <div className="flex gap-2 items-center">
              {!isAuthenticated && (
                <Button
                  size="md"
                  color="black"
                  title="EVM"
                  onClick={() => {
                    login();
                    setOpenLeftBar(!openLeftBar);
                  }}
                >
                  Login
                </Button>
              )}
              {isAuthenticated && (
                <>
                  <div className="flex gap-2">
                    <PointsBtn />

                    <div
                      onClick={() => {
                        setMenu("profile");
                        setIsProfileOpen(!isProfileOpen);
                        setOpenLeftBar(false);
                      }}
                      className="cursor-pointer flex gap-1 items-center bg-[#edecec] px-2 rounded-md my-2"
                    >
                      <div className="text-2xl">{points} </div>
                      <img className="h-5 mb-1" src={coinImg} alt="" />
                    </div>
                  </div>
                </>
              )}
              <div
                onClick={() => setOpenLeftBar(!openLeftBar)}
                className="bg-white p-2 rounded-lg"
              >
                <EditIconCreate />
              </div>
            </div>
          </div>
          {/* Middle Section */}
          <div className="h-full overflow-y-auto overflow-x-auto">
            {/* Categories */}
            {curOpenedPanel === "mobPanelHome" && (
              <div className="flex flex-col mx-4 gap-4 overflow-x-auto">
                <div>
                  <h1 className=" text-center text-wrap text-2xl font-bold py-4">
                    What will you post today?
                  </h1>
                </div>
                <div className="flex flex-wrap">
                  {actionBtns.map((btn, index) => (
                    <div
                      key={index}
                      className="w-1/2 px-2 mb-4"
                      onClick={btn.action}
                    >
                      <div className="h-24 p-8 bg-[#e2f74d] text-center border rounded-lg shadow-md flex items-center justify-center">
                        <p className="flex items-center gap-2">
                          {btn.icon}
                          {btn.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* stickers */}
                <h1 className=" text-center text-wrap text-lg font-bold pt-4">
                  Trending Stickers
                </h1>
                {stickersSections.map((section) => (
                  <div className="flex flex-col justify-between mt-4">
                    <div className="text-lg p-2 ">{section.author}</div>
                    <div className="flex w-full overflow-x-auto">
                      <CustomHorizontalScroller
                        type="props"
                        author={section.author}
                        campaign={section.campaign}
                      />
                    </div>
                  </div>
                ))}
                {/* memes */}
                {/* <h1 className=" text-center text-wrap text-lg font-bold py-4">
                  See what others are posting
                </h1> */}
                {/* <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <div className="text-lg p-2 "> </div>
                    <div
                      className="hover:bg-[#f3f2f2] cursor-pointer rounded-full p-2 flex items-center text-nowrap text-xs"
                      onClick={() => {
                        fnCloseLeftOpenEditorPanel("mobPanelStickers");
                        setCurOpenedTabLevel1("memes");
                      }}
                    >
                      See More
                      <EditIconRightArrow />{" "}
                    </div>
                  </div>

                  <div className="flex w-full overflow-x-auto pb-4">
                    <ImagesWithArrows imagesArr={MemesMob} />
                  </div>
                </div> */}
              </div>
            )}
            {curOpenedPanel === "mobPanelAI" && (
              <div className="mx-4 mt-16">
                {" "}
                <CompSearch />
              </div>
            )}
            {curOpenedPanel === "mobPanelMyFiles" && (
              <>
                <div className="mx-4 mt-2">
                  <DesignPanel />
                </div>
              </>
            )}
          </div>
          {/* Bottom bar for Home page  */}
        </div>
      </Drawer>
    </>
  );
};

export default MobileTopbar;
