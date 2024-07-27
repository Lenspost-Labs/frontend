import Toolbar from "polotno/toolbar/toolbar";
import React, { useContext } from "react";
import { useStore } from "../../../../../hooks/polotno";
import EditIconLeft from "../../../../../assets/EditIconsMobile/EditIconLeft";
import { Context } from "../../../../../providers/context";
import { Drawer } from "@material-tailwind/react";
import EditIconRight from "../../../../../assets/EditIconsMobile/EditIconRight";
import Logo from "../logo/Logo";
import MobileLoginBtn from "../auth/MobileLoginBtn";
import EditIconLeftArrow from "../../../../../assets/EditIconsMobile/EditIconLeftArrow";
import EditIconHome from "../../../../../assets/EditIconsMobile/EditIconHome";
import EditIconMyFIles from "../../../../../assets/EditIconsMobile/EditIconMyFIles";
import EditIconAI from "../../../../../assets/EditIconsMobile/EditIconAI";
import { DesignPanel } from "../../left-section/design/DesignSection";
import { CompSearch } from "../../left-section/image/AIImageSection";

const MobileTopbar = () => {
  const store = useStore();
  const { openLeftBar, setOpenLeftBar, curOpenedPanel, setCurOpenedPanel } =
    useContext(Context);

  return (
    <>
      <div className="flex items-center gap-2">
        <div
          onClick={() => setOpenLeftBar(!openLeftBar)}
          className="bg-white p-2 rounded-lg"
        >
          <EditIconLeft />
        </div>
        <Toolbar store={store} />
      </div>

      <Drawer
        size={Number(window && window?.innerWidth) || 0}
        placement="left"
        open={openLeftBar}
        onClose={() => setOpenLeftBar(!openLeftBar)}
        className=""
      >
        <div className="flex flex-col justify-between h-full">
          {/* Top bar for Home page */}
          <div className="flex justify-between items-center">
            <Logo propHeight={16} />
            <div className="flex gap-2 items-center">
              <MobileLoginBtn />
              <div
                onClick={() => setOpenLeftBar(!openLeftBar)}
                className="bg-white p-2 rounded-lg"
              >
                <EditIconRight />
              </div>
            </div>
          </div>

          {/* Categories */}
          {curOpenedPanel === "mobPanelHome" && (
            <div className="flex flex-col">
              <div className="flex justify-between items-center">
                <div className=""> GEN AI </div>
                <div className="">
                  {" "}
                  <EditIconLeftArrow />{" "}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className=""> Memes </div>
                <div className="">
                  {" "}
                  <EditIconLeftArrow />{" "}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className=""> Stickers</div>
                <div className="">
                  {" "}
                  <EditIconLeftArrow />{" "}
                </div>
              </div>
            </div>
          )}
          {curOpenedPanel === "mobPanelAI" && <CompSearch />}
          {curOpenedPanel === "mobPanelMyFiles" && <DesignPanel />}

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
