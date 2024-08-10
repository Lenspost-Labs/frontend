import React, { useEffect, useState } from "react";
import { NormieDP, NormieBadge, NormieHex } from "../../assets/svgs/Normie";
import { PlebDP, PlebBadge, PlebHex } from "../../assets/svgs/Pleb";
import { ChadDP, ChadBadge, ChadHex } from "../../assets/svgs/Chad";
import { useUser } from "../../../../../../../hooks/user";
import Coin from "../../assets/svgs/Coin.svg";
import iconReward from "../../assets/svgs/iconReward.svg";
import iconCheck from "../../assets/svgs/iconCheck.svg";
import iconLock from "../../assets/svgs/iconLock.svg";
const TaskCardV2 = ({
  taskId,
  taskType,
  taskName,
  taskDesc,
  taskAmount,
  isReward,
  isCompleted,
}) => {
  const { points, profileImage, userLevel } = useUser();
  const [stColor, setStColor] = useState("bg-green-50");

  const fnSetColor = () => {
    if (isCompleted) {
      setStColor("bg-green-50");
    }
    if (!isCompleted) {
      setStColor("bg-gray-100");
    }
    if (isReward) {
      setStColor("bg-yellow-100");
    }
  };

  useEffect(() => {
    fnSetColor();
  }, []);

  return (
    <>
      <div className="flex gap-2">
        <div
          className={`flex gap-2 items-center mb-2 mt-0 w-full rounded-lg ${stColor}`}
        >
          <div
            className={`flex align-middle justify-center items-center text-center rounded-md`}
          >
            <div className="flex align-middle justify-center items-center p-4">
              {isReward ? (
                <img className="rounded-full" src={iconReward} alt="profile" />
              ) : isCompleted ? (
                <img className="rounded-full" src={iconCheck} alt="profile" />
              ) : (
                taskId
              )}
            </div>
          </div>
          <div className={`flex flex-col p-4 pl-0 w-full rounded-md`}>
            <div className="text-md font-semibold">{taskName}</div>
            <div className="w-full text-gray-700 mt-2 ">{taskDesc}</div>
          </div>
        </div>
        <div className={`flex gap-1 items-end ${taskType == "MINT"?   "bg-blue-400 text-white" : "bg-orange-300 text-black" } w-fit h-5 px-2 rounded-full opacity-80 -ml-16 mt-2 shadow-md`}>
          <div className="flex align-middle items-center">
            <div className="">
              {isCompleted ? (
                <img className="h-4 text-white" src={iconCheck} alt="" />
              ) : isReward ? (
                <img className="h-4" src={iconLock} alt="" />
              ) : (
                <>
                  <div className="flex align-middle items-center gap-1 ">
                    <div className="">{taskType == "MINT"? `+${taskAmount}` : `-${taskAmount}`}</div>
                    <img className="h-4" src={Coin} alt="" />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCardV2;
