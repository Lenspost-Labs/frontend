import { Fragment, useContext, useState } from "react";
import { ShareIcon } from "../../../../../assets/assets";
import {
  ShareSection,
  SolanaMintWrapper,
  ZoraMint,
  LensShareWrapper,
  XShare,
  FarcasterShareWrapper,
} from "../../right-section";
import { Drawer } from "@blueprintjs/core";
import { Context } from "../../../../../providers/context";
import EditIconShare from "../../../../../assets/EditIconsMobile/EditIconShare";

const ShareButton = () => {
  const [transitionRtoL, setTransitionRtoL] = useState(false);

  const { menu, setMenu, isShareOpen, setIsShareOpen, isMobile } =
    useContext(Context);

  // const [isShareOpen, setIsShareOpen] = useState(false);

  const transitionCSS = {
    "transition-all": true,
    "-left-80 w-80": transitionRtoL,
    "left-0 w-80": !transitionRtoL,
  };

  return (
    <>
      {!isMobile && (
        <button
          onClick={() => {
            // setIsShareOpen(!isShareOpen);
            setIsShareOpen(true);
            setMenu("share");
          }}
          className="outline-none"
        >
          <ShareIcon />
        </button>
      )}

      {isMobile && (
        <div
          onClick={() => {
            setIsShareOpen(true);
            setMenu("share");
          }}
          className="flex items-center"
        >
          <EditIconShare />
        </div>
      )}
      <Drawer
        transitionDuration={200}
        isOpen={isShareOpen}
        canOutsideClickClose
        size={"small"}
        onClose={() => setIsShareOpen(false)}
        className={`relative z-1000`}
      >
        <div className="fixed overflow-hidden">
          <div className="overflow-scroll">
            <div className="fixed inset-y-0 right-0 flex max-w-full top-2">
              <div className="w-screen max-w-sm mb-2">
                {menu === "share" && <ShareSection />}
                {/* {menu === "allTasksnRewards" && <AllTasksNRewards/>} */}
                {/* {menu === "lensmonetization" && <LensShare />} */}
                {menu === "farcasterShare" && <FarcasterShareWrapper />}
                {menu === "lensmonetization" && <LensShareWrapper />}
                {menu === "solanaMint" && <SolanaMintWrapper />}
                {menu === "xshare" && <XShare />}
                {typeof menu === "number" && (
                  <ZoraMint selectedChainId={menu} />
                )}
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default ShareButton;
