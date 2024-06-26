import { useContext, useEffect, useState } from "react";
import { Drawer } from "@blueprintjs/core";
import { Context } from "../../../../../providers/context";
import { useAccount } from "wagmi";
import { getAvatar } from "../../../../../utils";
import { Avatar } from "@material-tailwind/react";
import { AllTasksNRewards } from "../../right-section/profile/components/section/AllTasksNRewards";
import ProfilePanel from "../../right-section/profile/ProfilePanel";

const PointsBtn = () => {
  const [transitionRtoL, setTransitionRtoL] = useState(false);

  const { menu, setMenu, isProfileOpen, setIsProfileOpen } =
    useContext(Context);
  const { address } = useAccount();

  const transitionCSS = {
    "transition-all": true,
    "-left-80 w-80": transitionRtoL,
    "left-0 w-80": !transitionRtoL,
  };

  useEffect(() => {
    setIsProfileOpen(false);
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setMenu("profile");
          setIsProfileOpen(!isProfileOpen);
        }}
        className="outline-none"
      >
        <Avatar
          onClick={() => ""}
          variant="circular"
          alt="profile picture"
          className="cursor-pointer outline outline-black"
          src={getAvatar(address)}
        />
      </button>

      <Drawer
        transitionDuration={200}
        isOpen={isProfileOpen}
        // canOutsideClickClose
        size={"small"}
        onClose={() => setIsProfileOpen(!isProfileOpen)}
        className={`relative z-1000`}
      >
        <div className="fixed overflow-hidden">
          <div className="overflow-scroll">
            <div className="fixed inset-y-0 right-0 flex max-w-full top-2">
              <div className="w-screen max-w-sm mb-2">
                {menu === "profile" && <ProfilePanel />}
                {menu === "allTasksnRewards" && <AllTasksNRewards />}
              </div>
            </div>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default PointsBtn;
