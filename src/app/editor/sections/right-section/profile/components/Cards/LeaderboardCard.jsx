import React from "react";
import { addressCrop } from "../../../../../../../utils";
import farcasterLogo from "../../../../../../../assets/logos/logoFarcaster.jpg";
const LeaderboardCard = ({
  lbIndex,
  lbUsername,
  lbPoints,
  lbfarcsterId,
  lbEVMAddress,
}) => {
  return (
    <>
      <div className="flex gap-2 bg-gray-100 m-2 p-2 rounded-md text-lg">
        <div className="flex flex-col gap-2 w-full px-2">
          <div className="flex justify-between w-full">
            <div className="flex gap-4">
              <div className="">#{lbIndex}</div>
              <div className="flex items-center gap-4">
                <div className="">
                  {lbUsername ? lbUsername : addressCrop(lbEVMAddress)}
                </div>
                {lbfarcsterId && (
                  <div
                    onClick={() =>
                      window.open(
                        "https://farcaster.xyz/~/profiles/" + lbfarcsterId,
                        "_blank"
                      )
                    }
                    className="flex items-center gap-2 cursor-pointer hover:opacity-80"
                  >
                    <img src={farcasterLogo} className="w-4 h-4 rounded-xl" />
                    {/* <div className="">{lbfarcsterId}</div> */}
                  </div>
                )}
              </div>
            </div>
            <div className="">{lbPoints}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeaderboardCard;
