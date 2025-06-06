import { Button, Dialog } from "@material-tailwind/react";
import BsChevronLeft from "@meronex/icons/bs/BsChevronLeft";
import BsChevronRight from "@meronex/icons/bs/BsChevronRight";
import VscVerified from "@meronex/icons/vsc/VscVerified";
import React, { useContext, useEffect, useState } from "react";
import { AIIcon } from "../../../../assets/assets";
import Gift from "../../../../assets/svgs/GiftOnboarding.svg";
import { LOCAL_STORAGE } from "../../../../data";
import useUser from "../../../../hooks/user/useUser";
import { Context } from "../../../../providers/context";
import { getFromLocalStorage } from "../../../../utils";
import { CompSearch } from "../../sections/left-section/image/AIImageSection";
import CustomImageComponent from "../core/CustomImageComponent";
import SubscriptionModal from "./SubscriptionModal";

const OnboardingModal = () => {
  const { isOnboardingOpen, setIsOnboardingOpen, isMobile } =
    useContext(Context);
  const [currentStep, setCurrentStep] = useState(0);
  const [isAuthenticatedBefore, setAuthenticatedBefore] = useState(false);
  const { points } = useUser();

  const handleOpen = () => setIsOnboardingOpen(!isOnboardingOpen);

  const StableDiffusionImages = [
    "https://lenspost-r2.b-cdn.net/ai_images/1738083494201.png",
    "https://lenspost-r2.b-cdn.net/ai_images/1738083510203.png",
    "https://lenspost-r2.b-cdn.net/ai_images/1738083523551.png",
  ];

  const LabubuImages = [
    "https://lenspost-r2.b-cdn.net/ai_images/1749118187763.png",
    "https://lenspost-r2.b-cdn.net/ai_images/1749118253313.png",
    "https://lenspost-r2.b-cdn.net/ai_images/1749118286214.png",
  ];

  const GlitchImages = [
    "https://lenspost-r2.b-cdn.net/ai_images/1749118935822.png",
    "https://lenspost-r2.b-cdn.net/ai_images/1749118974910.png",
    "https://lenspost-r2.b-cdn.net/ai_images/1749119022187.png",
  ];

  const MigglesImages = [
    "https://lenspost-r2.b-cdn.net/ai_images/1738149846318.png",
    "https://lenspost-r2.b-cdn.net/ai_images/1738149902276.png",
    "https://lenspost-r2.b-cdn.net/ai_images/1749119022187.png",
  ];

  const FluxImages = [
    "https://lenspost-r2.b-cdn.net/ai_images/1739109247705.png",
    "https://lenspost-r2.b-cdn.net/ai_images/1739109365012.png",
    "https://lenspost-r2.b-cdn.net/ai_images/1739109418632.png",
  ];

  const PepeImages = [
    "https://pub-2ae8c1134d9a4424b3e00475c4421a7a.r2.dev/Stickers/test/sdk-image-55c015c210-0x03d6519d6b3373eaa1d9e7402846bc9a52b9faee-e4c5aa.png",
    "https://pub-2ae8c1134d9a4424b3e00475c4421a7a.r2.dev/Stickers/test/sdk-image-123fbf280e-0x03d6519d6b3373eaa1d9e7402846bc9a52b9faee-e4c5aa.png",
    "https://pub-2ae8c1134d9a4424b3e00475c4421a7a.r2.dev/Stickers/test/sdk-image-e94a3abded-0x03d6519d6b3373eaa1d9e7402846bc9a52b9faee-e4c5aa.png",
  ];

  const steps = [
    // {
    //   title: "Congratulations!",
    //   content: (
    //     <>
    //       <div className="w-24 h-24 mx-auto mb-4 rounded-lg flex items-center justify-center">
    //         {/* <Gift className="w-16 h-16 text-[#E15F77]" /> */}
    //         <img src={Gift} alt="gift" />
    //       </div>
    //       <p className="text-xl mb-2">Boom! You've just earned</p>
    //       <p className="text-4xl font-bold text-[#E15F77] mb-4">50 xPOSTER</p>
    //       <p className="text-gray-600">
    //         create, share and earn more token 🍄🤑
    //       </p>
    //     </>
    //   ),
    // },
    // {
    //   title:
    //     "🔥 Unlock Poster Gold – Level Up Your Poster Game!\n✨ Why settle for less when you can go GOLD? ✨",
    //   content: (
    //     <>
    //       <ul className="space-y-2 text-left">
    //         {[
    //           "Create AI masterpieces – Your imagination, now in HD! 🧁",
    //           "Make backgrounds vanish – Like magic, but real. 🐰",
    //           "Save designs locally – Your computer will thank you. 💻",
    //           "Auto-save your work – No more "oops" moments. 😅",
    //           "Remove watermarks – With a snap. ✨",
    //           "Join epic campaigns – Exclusive token drops await! 🤑🍄",
    //         ].map((feature, index) => (
    //           <li key={index} className="flex items-start">
    //             <svg
    //               className="w-5 h-5 text-green-500 mr-2 mt-1 flex-shrink-0"
    //               fill="none"
    //               stroke="currentColor"
    //               viewBox="0 0 24 24"
    //               xmlns="http://www.w3.org/2000/svg"
    //             >
    //               <path
    //                 strokeLinecap="round"
    //                 strokeLinejoin="round"
    //                 strokeWidth="2"
    //                 d="M5 13l4 4L19 7"
    //               ></path>
    //             </svg>
    //             {feature}
    //           </li>
    //         ))}
    //       </ul>
    //       <p className=" pt-5 flex items-start">
    //         🚀 Upgrade to Poster Gold now & become the ultimate POSTER! 🚀
    //         {/* <br /> [ Get Poster Gold ] */}
    //       </p>
    //       <div className="w-1/4 mx-auto pt-5">
    //         <SubscriptionModal />
    //       </div>
    //     </>
    //   ),
    // },
    {
      title: "Poster AI Magic",
      content: (
        <div className="flex flex-row justify-between gap-2 max-h-full min-h-full">
          <>
            {/* <div className="w-1/4">
							{leftFeaturedImages?.map((img, index) => (
								<CustomImageComponent key={index} preview={img} alt="image" />
							))}
						</div> */}

            <div className="w-full">
              <CompSearch
                StableDiffusionImages={StableDiffusionImages}
                FluxImages={FluxImages}
                PepeImages={PepeImages}
                MigglesImages={MigglesImages}
                LabubuImages={LabubuImages}
                GlitchImages={GlitchImages}
              />
            </div>
          </>
        </div>
      ),
    },
  ];
  const [displayedSteps, setDisplayedSteps] = useState(steps);

  const fnCheckIfAuthenticatedBefore = () => {
    const oneMinute = 60 * 1000; // 60 seconds in milliseconds
    const jwtTimestamp = getFromLocalStorage(LOCAL_STORAGE.userAuthTime);
    const currentTimestamp = new Date().getTime();

    console.log(displayedSteps);
    console.log(steps);
    if (jwtTimestamp && currentTimestamp - jwtTimestamp > oneMinute) {
      setAuthenticatedBefore(true);

      // Reset the current step to the third step
      setCurrentStep(0);

      // Set displayedSteps to show only the third step
      setDisplayedSteps([steps[0]]);
    } else {
      setAuthenticatedBefore(false);

      // Reset the current step to the first step
      setCurrentStep(0);
      // Set displayedSteps to show all steps
      setDisplayedSteps(steps);
    }
  };

  useEffect(() => {
    fnCheckIfAuthenticatedBefore();
  }, []);

  return (
    <>
      <div className="mr-4">
        <Button
          onClick={handleOpen}
          className="p-4 py-2 text-black bg-[#e1f16b] rounded-lg"
        >
          <AIIcon />
          {!isMobile && <span className="ml-2">AI</span>}
        </Button>
        <Dialog open={isOnboardingOpen} handler={handleOpen}>
          {/* <DialogHeader>Poster AI Magic</DialogHeader> */}
          {/* <DialogBody> */}

          <div className="bg-white rounded-lg shadow-xl w-full p-6 pb-0 relative overflow-y-auto max-h-[90vh]">
            <div className="absolute top-0 right-4 pr-2 pt-3">
              <div className="flex items-center">
                <VscVerified className="inline-block w-5 h-5 text-[#E15F77] bg-[#fec6d0] rounded-full" />
                <span className="ml-1 text-gray-500">{points}</span>
              </div>
            </div>

            <h2 className="text-xl font-bold -mt-4 mb-4 text-center pr-14">
              {steps[currentStep]?.title}
            </h2>
            <div className="text-center mb-0">
              {steps[currentStep]?.content}
            </div>
            <div className="flex justify-between items-center cursor-pointer">
              <div className="space-x-1">
                {displayedSteps.map((_, index) => (
                  <span
                    key={index}
                    onClick={() => setCurrentStep(index)}
                    className={`inline-block w-2 h-2 rounded-full ${
                      index === currentStep ? "bg-[#E15F77]" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
              {currentStep < displayedSteps.length && (
                <>
                  <div className="flex gap-2">
                    {currentStep > 0 && (
                      <button
                        onClick={() => setCurrentStep(currentStep - 1)}
                        className="bg-[#E15F77] text-white rounded-full p-2"
                      >
                        <BsChevronLeft className="w-4 h-4" />
                      </button>
                    )}

                    {currentStep < displayedSteps.length - 1 && (
                      <button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        className="bg-[#E15F77] text-white rounded-full p-2"
                      >
                        <BsChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* </DialogBody> */}
        </Dialog>
      </div>
    </>
  );
};

export default OnboardingModal;
