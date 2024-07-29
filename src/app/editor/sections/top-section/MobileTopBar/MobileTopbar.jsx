import Toolbar from "polotno/toolbar/toolbar";
import React, { useContext, useEffect } from "react";
import { useStore } from "../../../../../hooks/polotno";
import EditIconLeft from "../../../../../assets/EditIconsMobile/EditIconLeft";
import { Context } from "../../../../../providers/context";
import { Button, Drawer } from "@material-tailwind/react";
import EditIconRight from "../../../../../assets/EditIconsMobile/EditIconRight";
import Logo from "../logo/Logo";
import MobileLoginBtn from "../auth/MobileLoginBtn";
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

const MobileTopbar = () => {
  const store = useStore();
  const { openLeftBar, setOpenLeftBar, curOpenedPanel, setCurOpenedPanel } =
    useContext(Context);
  const { login } = usePrivyAuth();
  const { isAuthenticated } = useAppAuth();

  const AIImagesMob = [
    "https://fal.media/files/monkey/cVoNvipRF_fUCUKcl7R-e.jpeg",
    "https://fal.media/files/monkey/riSVL2tWeSBIGatnuqgh7.jpeg",
    "https://fal.media/files/penguin/zgIytfvFc64PB77YJ8Wu3.jpeg",
    "https://fal.media/files/zebra/uHLqe_-pHJ0jQGi1AzbeD.jpeg",
    "https://fal.media/files/panda/bDddS2m9bojQ1jrl7EfI8.jpeg",
    "https://fal.media/files/koala/RUilq65w1LsE8IyALvB_p.jpeg",
  ];

  const MemesMob = [
    "https://i.imgflip.com/30b1gx.jpg",
    "https://i.imgflip.com/1g8my4.jpg",
    "https://i.imgflip.com/1b42wl.jpg",
    "https://i.imgflip.com/28j0te.jpg",
    "https://i.imgflip.com/9ehk.jpg",
    "https://i.imgflip.com/2ybua0.png",
    "https://i.imgflip.com/1bhk.jpg",
  ];

  const stickersMob = [
    "https://lenspost.s3.ap-south-1.amazonaws.com/Stickers/phi/phi-229.png",
    "https://lenspost.s3.ap-south-1.amazonaws.com/Stickers/phi/phi-237.png",
    "https://lenspost.s3.ap-south-1.amazonaws.com/Stickers/phi/phi-242.png",
    "https://lenspost.s3.ap-south-1.amazonaws.com/Stickers/phi/phi-248.png",
    "https://lenspost.s3.ap-south-1.amazonaws.com/Stickers/phi/phi-252.png",
  ];

  // To open Home on Panel Open
  useEffect(() => {
    if (!openLeftBar) {
      setCurOpenedPanel("");
    } else {
      setCurOpenedPanel("mobPanelHome");
    }
  }, [openLeftBar]);
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

        <div className="bg-white rounded-lg p-3">
          <DownloadBtn />
        </div>
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
          <div className="flex justify-between items-center m-2">
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
                  <div onClick={() => setOpenLeftBar(false)} className="">
                    <PointsBtn />
                  </div>

                  <div className="">{}</div>
                </>
              )}
              <div
                onClick={() => setOpenLeftBar(!openLeftBar)}
                className="bg-white p-2 rounded-lg"
              >
                <EditIconRight />
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
                    <div className="text-lg p-2 "> Gen AI </div>
                    {/* <div onClick={() => setOpenLeftBar(!openLeftBar)}>
                      {" "}
                      <EditIconRightArrow />{" "}
                    </div> */}
                  </div>

                  <div className="flex overflow-x-auto whitespace-nowrap">
                    <ImagesWithArrows imagesArr={AIImagesMob} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <div className="text-lg p-2 "> Memes </div>
                    {/* <div onClick={() => setOpenLeftBar(!openLeftBar)}>
                      {" "}
                      <EditIconRightArrow />{" "}
                    </div> */}
                  </div>

                  <div className="flex w-full overflow-x-auto">
                    <ImagesWithArrows imagesArr={MemesMob} />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <div className="text-lg p-2 "> Featured backgrounds </div>
                    {/* <div onClick={() => setOpenLeftBar(!openLeftBar)}>
                      {" "}
                      <EditIconRightArrow />{" "}
                    </div> */}
                  </div>
                  <CompCarousel type="background" />
                </div>
                <div className="flex flex-col">
                  <div className="flex justify-between items-center">
                    <div className="text-lg p-2 "> Stickers </div>
                    {/* <div onClick={() => setOpenLeftBar(!openLeftBar)}>
                      {" "}
                      <EditIconRightArrow />{" "}
                    </div> */}
                  </div>

                  <div className="flex w-full overflow-x-auto">
                    {/* {stickersMob.map((img, index) => (
                      <CustomImageComponent
                        imgClassName="h-32"
                        className="h-32"
                        preview={img}
                        key={index}
                      />
                    ))} */}

                    {/* Featured Stickers */}
                    <CustomHorizontalScroller
                      type="props"
                      author="ham"
                      campaign={null}
                    />
                  </div>
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
              <div className="mx-4 mt-2">
                <DesignPanel isMobile />
              </div>
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
                }  p-2 rounded-full -mb-4 shadow-xl ease-in-out duration-300`}
              >
                {" "}
                <EditIconAI />{" "}
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
