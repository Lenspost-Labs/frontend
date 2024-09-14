import React, { useContext, useEffect } from "react";
import Lottie from "lottie-react";
// Donate more Modal imports - Blueprintjs 20Aug2023
import { Button, Popover } from "@blueprintjs/core";
import { Slider } from "@blueprintjs/core";
import { useState } from "react";
import { Context } from "../../../../providers/context/ContextProvider";

const CustomPopover = ({ icon, animationData }) => {
  const { enabled, setEnabled } = useContext(Context);
  const [stSliderValue, setStSliderValue] = useState();

  const newArray = [...enabled.splitRevenueRecipients];

  const fnHandleSliderChange = (value) => {
    setStSliderValue(value);
    // update the split value at index 0
    newArray[0].split = value;

    // update the splitRevenueRecipients array
    setEnabled({
      ...enabled,
      splitRevenueRecipients: newArray,
    });
  };

  // const fnHandleSplitConfirm = () => {
  //   // update the split value at index 0
  //   newArray[0].split = stSliderValue;

  //   // update the splitRevenueRecipients array
  //   setEnabled({
  //     ...enabled,
  //     splitRevenueRecipients: newArray,
  //   });
  // };

  useEffect(() => {
    setStSliderValue(enabled.splitRevenueRecipients[0].split || 10);
  }, []);
  return (
    <>
      {/* Donate more Modal components - Blueprintjs 20Aug2023 */}
      <div
        // className='ml-4 mb-4'
        className="ml-4"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {/* Popover starts here */}
        <Popover
          content={
            <>
              <div className="w-64 p-1 rounded-md bg-gradient-to-t from-white to-[#ECF7A0]">
                {/* background gradient using tailwind  */}
                {/* div className="rounded-md bg-gradient-to-r from-green-400 to-blue-500"> */}
                <div className="rounded-md bottom-4 m-2 p-2">
                  {/* text gradient css using tailwindcss  */}
                  <div className="mb-1 text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-blue-400">
                    Thank you
                  </div>
                  <div className="">
                    <div className="mb-6">
                      For considering to split your post's revenue with{" "}
                      <a
                        href="https://lenster.xyz/u/lenspostxyz"
                        target="_blank"
                      >
                        @lenspostxyz.
                      </a>
                      <br /> We believe that this will help us to grow and
                      provide better services to you.
                    </div>
                    <div className="ml-1 mt-2 mb-1">
                      choose split percentage
                    </div>
                    {/* This is the slider from Blueprintjs/core  */}
                    <div className="m-1 mt-0 p-1">
                      <Slider
                        min={10}
                        max={50}
                        stepSize={5}
                        labelStepSize={10}
                        onChange={(value) => fnHandleSliderChange(value)}
                        value={stSliderValue}
                        labelRenderer={stSliderValue}
                      />
                    </div>
                    {/* <div className="w-full mt-1">
                        <Button
                          intent="primary"
                          small
                          onClick={fnHandleSplitConfirm}
                          className="w-full py-0"
                        >
                          Confirm
                        </Button>
                      </div> */}
                  </div>
                </div>
              </div>
            </>
          }
          position={"auto"}
        >
          <div>
            {/* If there is any Lottie `animationData` passed only then display animation*/}
            {animationData ? (
              <Lottie
                className="h-8 cursor-pointer"
                animationData={animationData}
              />
            ) : (
              <Button
                small
                className="px-2 py-0"
                icon={`${icon ? icon : "help"}`}
              />
            )}
          </div>
        </Popover>
        {/* Popover Ends here */}
      </div>
    </>
  );
};
export default CustomPopover;
