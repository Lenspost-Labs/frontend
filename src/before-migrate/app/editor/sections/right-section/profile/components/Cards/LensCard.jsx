import React, { useContext } from "react";
import LensLogo from "../../assets/svgs/LogoLens.svg";
import Coin from "../../assets/svgs/Coin.svg";
import { Context } from "../../../../../../../providers/context/ContextProvider";
import { Button } from "@material-tailwind/react";

const LensCard = () => {
  const { userProfileDetails } = useContext(Context);

  const fnClaimLensHandle = () => {
    
  }

  return (
    <>
      <div className="flex flex-col bg-[#9bea1d30] m-4 mt-2 rounded-md ">
        <div className="flex justify-between ">
          <div className="font-semibold text-md p-4 pb-1 pt-4 text-[#313131]">
            {" "}
            Claim your Lens Handle
          </div>
          <div className="mt-2">
            {" "}
            <img className="h-10" src={LensLogo} alt="" />
          </div>
        </div>

        <div className="flex align-middle ml-4 mb-4 mt-2">
          {/* Points < 50 : Show Message */}
          {userProfileDetails?.points < 50 && (
            <div className="text-sm">
              Get 100 <img className="h-3" src={Coin} alt="" /> to claim your
              Lens handle from Lenspost{" "}
            </div>
          )}
          {/* Points >= 50 : Show CTA to claim Lens handle */}

          {userProfileDetails?.points >= 50 && (
            <div className="text-sm">
              <Button onClick={fnClaimLensHandle} className="rounded-md" size="sm" fullWidth> Claim </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LensCard;
