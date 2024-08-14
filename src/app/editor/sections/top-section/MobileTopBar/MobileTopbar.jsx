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
import usePrivyAuth from "../../../../../hooks/privy-auth/usePrivyAuth";
import { useAppAuth } from "../../../../../hooks/app";
import { EVMLogo } from "../../../../../assets";
import PointsBtn from "../PointsBtn/PointsBtn";
import ImagesWithArrows from "../../../common/core/CustomsTabsWArrows/ImagesWithArrows";
import DownloadBtn from "../download/DownloadBtn";
import { useUser } from "../../../../../hooks/user";
import EditIconCreate from "../../../../../assets/EditIconsMobile/EditIconCreate";
import { useQuery } from "@tanstack/react-query";
import { apiGetAllMemes } from "../../../../../services";
import useMobilePanelFunctions from "../../../common/mobileHooks/useMobilePanelFunctions";

const MobileTopbar = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const actionType = params.get("actionType");

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
        {actionType !== "composer" && (
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
                <Button size="md" color="black" title="EVM" onClick={login}>
                  <img
                    src={EVMLogo}
                    alt="evm"
                    className="h-4 w-4 object-contain bg-cover mr-2"
                  />
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
                      <img
                        className="h-5 mb-1"
                        src="/public/svgs/coin.svg"
                        alt=""
                      />
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
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    {/* <div onClick={() => setOpenLeftBar(!openLeftBar)}>
                      {" "}
                      <EditIconRightArrow />{" "}
                    </div> */}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <div className="text-lg p-2 "> Memes </div>
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

                  <div className="flex w-full overflow-x-auto">
                    <ImagesWithArrows imagesArr={MemesMob} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <div className="text-lg p-2 ">
                      {" "}
                      Featured campaign{" "}
                      <span className="text-[#2C346B] italic bg-[#ecff5f] py-0.5 px-4 rounded-full border">
                        {" "}
                        #SummerOfPhi{" "}
                      </span>
                    </div>
                    <div
                      className="hover:bg-[#f3f2f2] cursor-pointer rounded-full p-2 flex items-center text-nowrap text-xs"
                      onClick={() => {
                        fnCloseLeftOpenEditorPanel("mobPanelStickers");
                        setCurOpenedTabLevel1("stickers");
                      }}
                    >
                      See More
                      <EditIconRightArrow />{" "}
                    </div>
                  </div>

                  <div className="flex w-full overflow-x-auto">
                    {/* Featured Stickers */}
                    <CustomHorizontalScroller
                      type="props"
                      author="phi"
                      campaign={null}
                    />
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-lg p-2 "> Featured community </div>
                    {/* <div
                      className="hover:bg-[#f3f2f2] cursor-pointer rounded-full p-2"
                      onClick={() => {
                        fnCloseLeftOpenEditorPanel("mobPanelStickers");
                        setCurOpenedTabLevel1("stickers");
                      }}
                    >
                      {" "}
                      <EditIconRightArrow />{" "}
                    </div> */}
                  </div>

                  <div className="flex w-full overflow-x-auto">
                    {/* Featured Stickers */}
                    <CustomHorizontalScroller
                      type="props"
                      author="ham"
                      campaign={null}
                    />
                  </div>
                </div>

                {actionType != "composer" && (
                  <div className="flex flex-col">
                    <div className="flex justify-between items-center">
                      <div className="text-lg p-2 "> Featured backgrounds </div>
                      {/* <div
                        className="hover:bg-[#f3f2f2] cursor-pointer rounded-full p-2"
                        onClick={() =>
                          fnCloseLeftOpenEditorPanel("mobPanelStickers")
                        }
                      >
                        {" "}
                        <EditIconRightArrow />{" "}
                      </div> */}
                    </div>
                    <CompCarousel type="background" />
                  </div>
                )}
                <div className="text-lg p-2 "> Gen AI </div>

                <div className="flex overflow-x-auto whitespace-nowrap">
                  <ImagesWithArrows imagesArr={AIImagesMob} />
                </div>
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
          <div className="">
            <div className="flex flex-col items-center  mx-2 my-1 ">
              <div
                onClick={() => {
                  console.log("mobPanelAI");
                  setCurOpenedPanel("mobPanelAI");
                }}
                className={` ${
                  curOpenedPanel === "mobPanelAI"
                    ? "bg-[#e1f16b]"
                    : "bg-[#F8F8F8]"
                }  p-2 rounded-full -mb-8 shadow-xl ease-in-out duration-300`}
              >
                {" "}
                <EditIconAI needAnimation={true} />
                {/* <div className="text-lg w-8 h-8 rounded-full flex items-center">AI</div> */}
              </div>
            </div>

            <div className="bg-[#F8F8F8] p-2 mx-2 my-1 rounded-lg">
              <div className="flex justify-between items-center">
                <div
                  onClick={() => {
                    console.log("mobPanelHome");
                    setCurOpenedPanel("mobPanelHome");
                  }}
                  className={`${
                    curOpenedPanel === "mobPanelHome" ? "bg-[#e1f16b]" : ""
                  } p-1 rounded-lg ease-in-out duration-300`}
                >
                  <EditIconHome />
                </div>

                <div
                  onClick={() => {
                    console.log("mobPanelMyFiles");
                    setCurOpenedPanel("mobPanelMyFiles");
                  }}
                  className={`${
                    curOpenedPanel === "mobPanelMyFiles" ? "bg-[#e1f16b]" : ""
                  } p-1 rounded-lg ease-in-out duration-300`}
                >
                  <EditIconMyFIles />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default MobileTopbar;
