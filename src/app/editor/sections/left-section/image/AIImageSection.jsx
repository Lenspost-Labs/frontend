// ---- ----
// ---- Working yet - Under DEV - Created: 20Jul2023  Updated:27Jul2023 ----
// ---- This section is same as stable-diffusion-section.jsx ----
// ---- ----

import React, { useState, useEffect, useRef, useContext } from "react";
import { SectionTab } from "polotno/side-panel";
import { AIIcon } from "../../../../../assets/assets";
import axios from "axios";
import FormData from "form-data";
import { CustomImageComponent, MessageComponent } from "../../../common";
import {
  Textarea,
  Button as MatButton,
  Select,
  Option,
  Button,
  Dialog,
} from "@material-tailwind/react";
import {
  consoleLogonlyDev,
  errorMessage,
  firstLetterCapital,
} from "../../../../../utils";
import Lottie from "lottie-react";
import animationData from "../../../../../assets/lottie/loaders/aiGeneration.json";
import { useStore } from "../../../../../hooks/polotno";
import { Context } from "../../../../../providers/context";
import { Tab, Tabs, TabsHeader, TabsBody } from "@material-tailwind/react";
import {
  checkTokenClaimed,
  claimReward,
  ENVIRONMENT,
  getAIImage,
  getFalImgtoImg,
} from "../../../../../services";
import useUser from "../../../../../hooks/user/useUser";
import coinImg from "../../../../../assets/svgs/Coin.svg";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocalStorage } from "../../../../../hooks/app";
import { toast } from "react-toastify";
import { useAccount } from "wagmi";
import { DEV_LABUBU_MINT_URL, PROD_LABUBU_MINT_URL } from "../../../../../data";
// Tab1 - Search Tab

// const RANDOM_QUERIES = [
// 	'A serene lakeside scene at sunset with vibrant orange and purple hues reflecting off the calm waters.',
// 	'An otherworldly forest with bioluminescent plants and colorful creatures lurking in the shadows.',
// 	'Sea turtles gracefully gliding through the water, and a hidden shipwreck waiting to be explored.',
// ]

// This array is to display other queries on the frontend - 22Jul2023
const RANDOM_QUERIES2 = [
  // "A bustling marketplace in a medieval fantasy setting",
  "Lunar new year (year of the snake)",
  "waifu pixie angel in eden garden",
  "A robot DJ playing music on a holographic turntable surrounded by dancing crowds",
];

const PEPE_QUERIES = [
  "cyber pepe the memecoin millionaire on a cruise",
  "Gladiator Pepe in a Roman Colosseum, raising his sword as the crowd cheers",
  "Pepe as a 1920s mob boss, wearing a pinstripe suit and fedora, holding a cigar in one hand and a stack of cash in the other.",
];
const FLUX_QUERIES = [
  'A spiderman inside the air while he swings at his spidernet holding a sign with the text "poster.fun"',
  "Sage with dreadlocks in mahakumbh taking a holy dip photorealistic movie poster",
  "A cyberpunk cityscape with neon lights and flying cars at night",
];

const MIGGLES_QUERIES = [
  "Miggles as Superman",
  "Miggles shaking hands with President Trump",
  "Miggles takes over Japan",
  "Miggles as Batman",
];

const GLITCH_QUERIES = [
  "A cathedral in the glitch style",
  "A glitched out selfie sent back from the year 3025",
  "Doge overlord glitching across infinite chains",
];

const LABUBU_QUERIES = [
  "A labubu doll in spiderman suit",
  "Three labubus playing in a garden",
];

// This array is to display short words as prompts on the frontend - 22Jul2023
const RANDOM_QUERIES3 = [
  "Trump",
  "Crypto Bull",
  "Snow",
  "Winter",
  "Mountains",
  "Hearts",
  "Robots",
  "NFTS",
  "Elon",
];

export const CompSearch = ({
  StableDiffusionImages,
  isPanel = false,
  FluxImages,
  PepeImages,
  MigglesImages,
  LabubuImages,
  GlitchImages,
}) => {
  const {
    setOpenLeftBar,
    openLeftBar,
    openBottomBar,
    setOpenBottomBar,
    isMobile,
    assetsRecipientDataRef,
    parentRecipientListRef,
  } = useContext(Context);
  const store = useStore();
  const { points } = useUser();
  const { userId } = useLocalStorage();
  const { address } = useAccount();

  // load data
  const [data, setData] = useState(null);
  const [stStatusCode, setStStatusCode] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [model, setModel] = useState("labubu");
  const [showNftPrompt, setShowNftPrompt] = useState(false);

  const [query, setQuery] = useState();
  // RANDOM_QUERIES[(RANDOM_QUERIES.length * Math.random()) | 0]

  const queryClient = useQueryClient();

  const { mutateAsync: aiMutate } = useMutation({
    mutationKey: "ai-text-to-image",
    mutationFn: getAIImage,
  });

  const { mutateAsync: mutClaimReward } = useMutation({
    mutationFn: async ({ taskId }) => {
      try {
        const result = await claimReward({ taskId: taskId });

        // Refetch the user profile after successful claim
        await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

        return result;
      } catch (error) {
        console.error("Error claiming reward:", error);
        throw error;
      }
    },
  });

  const fnGenerateImages = async () => {
    if (!query) {
      return;
    }
    if (!points) {
      setError(`Error Fetching Poster Gold`);
      return;
    }
    if (points < 1) {
      setError(`Not enough Poster Gold`);
      return;
    }

    console.log("model", model);

    // if model is labubu, then check if the user (address) has claim the nft or not
    if (model === "labubu") {
      try {
        // if user has not claimed the nft,
        const res = await checkTokenClaimed(address);
        console.log("res", res?.data);
      } catch (error) {
        console.log("error", error);
        setError("Please claim the Labubu NFT to generate image");
        setShowNftPrompt(true);
        return;
      }
    }

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        setIsLoading(true);
        let finalQuery = query;

        if (model === "MiggleV3" && !query.toLowerCase().includes("miggles")) {
          finalQuery = `miggles ${query}`;
        }
        finalQuery = finalQuery.replace("Miggles", "miggles");

        let provider = "stability";

        if (model === "glitch") {
          provider = "fal/glitch";
          finalQuery = `${query} in a glitched out and circuitbent style`;
        } else if (model === "labubu") {
          provider = "fal/labubu";
          finalQuery = `In labubu style , ${query}`;
        } else if (model === "SD3") {
          provider = "stability";
        } else {
          provider = "heurist";
        }

        const response = await aiMutate({
          prompt: finalQuery,
          model,
          provider,
        });
        setStStatusCode(response.data.status);
        if (response.data.status === "success") {
          setIsLoading(false);
          setStStatusCode(200);
          setData(response.data.data);

          // try {
          //   await mutClaimReward({
          //     taskId: 5,
          //   });
          // } catch (claimErr) {
          //   console.error("mutClaimReward failed:", errorMessage(claimErr));
          //   setError("Reward claim failed. Please try again later.");
          // }
        } else if (response.data.status === 429) {
          setIsLoading(false);
          setStStatusCode(429);
        }
      } catch (e) {
        console.log("fnGenerateImages err: ", errorMessage(e));
        // setError(e);
        setError(errorMessage(e));
        setIsLoading(false);
        // setStStatusCode(429);
      }
      setIsLoading(false);
    }
    load();
  };

  const handleMintNFT = async () => {
    window.open(
      ENVIRONMENT === "development"
        ? DEV_LABUBU_MINT_URL
        : PROD_LABUBU_MINT_URL,
      "_blank"
    );
  };

  let featuredImagesToUse = StableDiffusionImages;
  if (model === "MiggleV3") {
    featuredImagesToUse = MigglesImages;
  } else if (model === "PepeXL") {
    featuredImagesToUse = PepeImages;
  } else if (model === "FLUX.1-dev") {
    featuredImagesToUse = FluxImages;
  } else if (model === "labubu") {
    featuredImagesToUse = LabubuImages;
  } else if (model === "glitch") {
    featuredImagesToUse = GlitchImages;
  }

  useEffect(() => {
    fnGenerateImages();
  }, []);

  useEffect(() => {
    consoleLogonlyDev(query);
  }, [query]);

  const { zoraErc721Enabled, setZoraErc721Enabled } = useContext(Context);

  const addModelAttribution = (walletAddress) => {
    // Wait for the image to be added to the canvas and get its ID
    setTimeout(() => {
      const elementId = store.selectedElements[0]?.id;
      if (elementId) {
        // Add to assetsRecipientDataRef
        assetsRecipientDataRef.current.push({
          elementId,
          recipient: walletAddress,
        });

        // Add to parentRecipientListRef
        if (!parentRecipientListRef.current.includes(walletAddress)) {
          parentRecipientListRef.current.push(walletAddress);
        }

        // Add to zoraErc721Enabled for royalty information
        try {
          const key = "royaltySplitRecipients";
          setZoraErc721Enabled({
            ...zoraErc721Enabled,
            [key]: [
              ...zoraErc721Enabled[key],
              {
                address: walletAddress,
                percentAllocation: 10,
              },
            ],
          });
        } catch (e) {
          console.log("Error adding model attribution:", e);
        }
      }
    }, 100); // Small delay to ensure the element is added to the canvas
  };

  const addMiggleAdd = () => {
    try {
      const key = "royaltySplitRecipients";

      setZoraErc721Enabled({
        ...zoraErc721Enabled,
        [key]: [
          ...zoraErc721Enabled[key],
          {
            address: "0x736945D761Fbe16fe52A1f4D27F3abe7faA0C27c",
            percentAllocation: 10,
          },
        ],
      });
      console.log("after", zoraErc721Enabled);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <div className="">
        <div className="flex flex-col gap-2">
          <div>
            <Select
              value={model}
              label="Select AI Model"
              onChange={(val) => setModel(val)}
            >
              {/*  <Option value="MiggleV3">Miggles</Option> */}
              {/*  <Option value="PepeXL">Pepe</Option> */}
              <Option value="labubu">Labubu 💎 </Option>
              <Option value="glitch">GLITCH 🌈 by LetsGlitchIt </Option>
              <Option value="SD3"> Stable Diffusion ⚙️</Option>
            </Select>
            <div className="mt-2 text-sm font-medium">
              {model === "labubu" && (
                <p className="font-semibold bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-2 rounded-lg text-purple-700">
                  TikTok $419B IP | Exclusively on Poster.fun
                </p>
              )}
              {model === "glitch" && (
                <p className="bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-indigo-500/20 p-2 rounded-lg text-purple-800 font-semibold">
                  Pride Month Special | Mint Yours Now on Poster.fun
                </p>
              )}
              {model === "SD3" && (
                <p className="font-semibold bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-2 rounded-lg text-blue-700">
                  High-End, All-Purpose AI Powerhouse
                </p>
              )}
            </div>
          </div>
          <Textarea
            leftIcon="search"
            label="Search or Give a prompt"
            onChange={(e) => {
              setQuery(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                fnGenerateImages();
              }
            }}
            value={query}
            type="search"
          />
          <MatButton className="mb-4" onClick={fnGenerateImages}>
            Generate
            <img className="h-4 -mt-1 ml-2" src={coinImg} alt="" />
          </MatButton>
        </div>
        <div className="flex flex-row justify-between items-center gap-2 w-full">
          <div
            className={`${
              model === "MiggleV3" ||
              model === "PepeXL" ||
              model === "FLUX.1-dev"
                ? "sm:grid w-full grid-cols-2 overflow-x-scroll"
                : "overflow-auto"
            }`}
          >
            {(model === "MiggleV3"
              ? MIGGLES_QUERIES
              : model === "PepeXL"
              ? PEPE_QUERIES
              : model === "FLUX.1-dev"
              ? FLUX_QUERIES
              : model === "glitch"
              ? GLITCH_QUERIES
              : model === "labubu"
              ? LABUBU_QUERIES
              : RANDOM_QUERIES2
            ).map((val, key) => {
              return (
                <div
                  key={key}
                  onClick={() => setQuery(val)}
                  className="m-1 mb-2 px-2 py-1 text-xs rounded-md cursor-pointer bg-blue-50 hover:bg-blue-100 overflow-x-scroll"
                >
                  {val}
                </div>
              );
            })}
          </div>
          {!isPanel &&
            model !== "MiggleV3" &&
            model !== "PepeXL" &&
            model !== "FLUX.1-dev" && (
              <div className="hidden sm:grid grid-cols-3 overflow-x-scroll">
                {RANDOM_QUERIES3.map((val, key) => {
                  return (
                    <div
                      onClick={() => setQuery(val)}
                      className="m-1 mb-2 items-center justify-center flex px-2 py-1 text-xs rounded-md cursor-pointer bg-blue-50 hover:bg-blue-100"
                    >
                      {val}
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>

      {!isLoading && error && (
        <div className="mt-4 p-2 text-red-600 bg-red-50 rounded-md">
          {error}
        </div>
      )}
      {/* {isLoading && <LoadingAnimatedComponent />} */}
      {isLoading && (
        <div className="mt-0 text-center text-blue-600">
          <Lottie animationData={animationData} className="h-64" />
          {/* Generating Image... */}
        </div>
      )}
      {!data && !isLoading && (
        <>
          <div className="p-2 pb-4  text-center text-gray-500">
            Unleash your creativity — Enter a prompt and let AI do the magic!
          </div>
          {featuredImagesToUse && (
            <>
              <div className="flex flex-row justify-between gap-2 w-full">
                {featuredImagesToUse?.map((img, index) => (
                  <CustomImageComponent key={index} preview={img} alt="image" />
                ))}
              </div>
              <div className="p-2 pb-4  text-center text-gray-500">
                Get inspired with trending festive AI art prompts — Choose,
                click, and create!
              </div>
            </>
          )}
        </>
      )}

      {!isLoading && stStatusCode === 200 && (
        <div className="flex flex-row  items-center justify-center gap-2 w-full">
          {data?.images?.map((val, key) => (
            <div
              onClick={() => {
                if (isMobile) {
                  if (openBottomBar) {
                    setOpenBottomBar(false);
                  }
                  if (openLeftBar) {
                    setOpenLeftBar(false);
                  }
                }

                if (model === "MiggleV3") addMiggleAdd();
                if (model === "glitch") {
                  addModelAttribution(
                    "0x22ec7a4429c381f5c382ac7ea624cc05d37ffdde"
                  );
                }
              }}
              className="max-w-md w-full"
            >
              <CustomImageComponent key={key} preview={val} />
            </div>
          ))}
        </div>
      )}
      {stStatusCode === 429 && (
        // <div className="mt-4 p-2 text-orange-600 bg-orange-100 rounded-md">
        //   You are Rate limited for now, Please check back after 60s
        // </div>
        <MessageComponent message="You are Rate limited for now, Please check back after 60s" />
      )}
      {/* {!data && "Start exploring"} */}

      {/* NFT Mint Prompt Modal */}
      <Dialog
        size="sm"
        open={showNftPrompt}
        handler={() => setShowNftPrompt(false)}
        animate={{
          mount: { scale: 1, y: 0 },
          unmount: { scale: 0.9, y: -100 },
        }}
        className="bg-transparent shadow-none"
      >
        <div className="bg-white rounded-3xl shadow-2xl max-w-sm mx-auto overflow-hidden">
          <div className="p-8 text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 mx-auto mb-4 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full animate-pulse"></div>
                <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                  <div className="text-3xl animate-bounce">🪙</div>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Labubu Locked 🔒
            </h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              You need a{" "}
              <span className="font-semibold">License to Meme pass</span> before
              the generator fires up. Mint one, unlock unlimited Labubu magic.
            </p>
            <div className="space-y-3">
              <Button
                onClick={handleMintNFT}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-4 px-6 rounded-2xl shadow-lg transition-all duration-200 transform hover:scale-[1.02] border-0 text-base"
              >
                MINT NOW
              </Button>
              <Button
                variant="outlined"
                className="w-full bg-gray-800 text-white hover:bg-gray-700 border-gray-800 py-4 px-6 rounded-2xl font-semibold transition-all duration-200"
                onClick={() => setShowNftPrompt(false)}
              >
                CLOSE
              </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
};

const CompDesignify = () => {
  const callApi = async () => {
    const form = new FormData();
    // Assuming you have access to the image file through a file input element.
    const fileInput = document.getElementById("fileInput");
    form.append("image_file", fileInput.files[0]);

    try {
      const response = await axios({
        method: "post",
        url: "https://api.designify.com/v1.0/designify/:designId",
        data: form,
        responseType: "arraybuffer",
        headers: {
          "Content-Type": "multipart/form-data",
          // "X-Api-Key": "9822b7f73ff3bea87eee20370ac3982e",
          "X-Api-Key": "2f9772c386495a636efc72709d1a312f",
        },
      });

      if (response.status !== 200) {
        console.error("Error:", response.status, response.statusText);
      } else {
        // Assuming you want to display the image or do something else with it.
        // For example, displaying it in an <img> tag:
        const blob = new Blob([response.data], { type: "image/png" });
        const imageUrl = URL.createObjectURL(blob);
        const imageElement = document.getElementById("imageElement");
        imageElement.src = imageUrl;
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      {/* Input element for selecting the image file */}
      <input type="file" id="fileInput" />
      {/* Image element to display the retrieved image */}
      <img id="imageElement" src="" alt="Design" />
      <button onClick={callApi}>Generate</button>
    </div>
  );
};

const CompInstructImage = () => {
  const { fastPreview } = useContext(Context);
  const { points } = useUser();
  const [responseImage, setResponseImage] = useState(""); // For Newly generated Image Preview
  const [uploadedImg, setUploadedImg] = useState(); //For Uploaded Preview
  const [clicked, setClicked] = useState(false);
  const [stImgPrompt, setStImgPrompt] = useState(
    "A serene lakeside scene at sunset with vibrant orange and purple hues reflecting off the calm waters."
  );
  const [stDisplayMessage, setStDisplayMessage] = useState(
    "Choose an Image & Click on GENERATE to customize image based on your prompt"
  );

  // Testing all the APIs from getimg.ai
  // Function : json to base64

  const queryClient = useQueryClient();

  const { mutateAsync: mutClaimReward } = useMutation({
    mutationFn: async ({ taskId }) => {
      try {
        const result = await claimReward({ taskId: taskId });

        // Refetch the user profile after successful claim
        await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

        return result;
      } catch (error) {
        console.error("Error claiming reward:", error);
        throw error;
      }
    },
  });

  const fnJsonToBase64 = (json) => {
    return btoa(JSON.stringify(json));
  };

  const fnCallInstructImgAPI = async () => {
    // if (!points) {
    //   toast.error(`Error Fetching ${posterTokenSymbol} Points`);
    //   return;
    // }
    // if (points < 1) {
    //   toast.error(`Not enough ${posterTokenSymbol} points`);
    //   return;
    // }

    setClicked(true);
    setResponseImage("");

    // const options = {
    //   method: "POST",
    //   headers: {
    //     accept: "application/json",
    //     "content-type": "application/json",
    //     authorization:
    //       "Bearer key-2ldCt5QwA0Jt9VxoHDWadZukBnQKqM9Rcj9UBZPRVR0eh8sbhLzMylCMmNreNR5GqwgsMJmoolcBGA5JBgUleuP2BqWNiYZ2",
    //     // "Bearer key-4tA8akcKtGFZQwipltBWJz3CCe1Jh6u7PX59uRJY9U6wEvareOdhlhWgCiMWnZeCz9CC6GIJLaddIJGbHr5crjfz6ROXTUXY"
    //   },
    //   body: JSON.stringify({
    //     // data: {
    //     prompt: stImgPrompt,
    //     // image: base64Stripper(uploadedImg),
    //     // image: `${base64Stripper(uploadedImg)}`,
    //     image: base64Stripper(uploadedImg),
    //   }),
    // };

    // await fetch("https://api.getimg.ai/v1/stable-diffusion/instruct", options)
    // await fetch(
    //   "https://api.getimg.ai/v1/stable-diffusion/image-to-image",
    //   options
    // )
    await getFalImgtoImg(uploadedImg, stImgPrompt)
      .then((response) => {
        if (!response.data.images) {
          setResponseImage("");
          setStDisplayMessage("It's not you, it's us. Please try again later.");
        }
        setResponseImage(response.data.images[0].url);
        // }
        // if (response.status === 500) {
        //   setResponseImage("");
        //   setStDisplayMessage("It's not you, it's us. Please try again later.");
        // }
        // if (response.status > 400 && response.status < 500) {
        //   setResponseImage("");
        //   setStDisplayMessage(response.data.error.type);
        // }

        // mutClaimReward({
        //   taskId: 5,
        // });
        setClicked(false);
      })
      .catch((err) => {
        console.error("err", err);
        if (err.response.status == 401) {
          setResponseImage("");
          setStDisplayMessage(err.response.data.error.type);
        }
      });
    setClicked(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // When the file has been read successfully, the result will be a Base64 encoded string
        const base64String = reader.result;
        setUploadedImg(base64String);
      };

      reader.readAsDataURL(file);
    }
  };

  const fnUseThisCanvas = () => {
    setUploadedImg(fastPreview[0]);
  };

  useEffect(() => {
    setUploadedImg(uploadedImg);
  }, [uploadedImg]);

  return (
    <>
      <div className="h-full overflow-y-auto">
        <div className="m-1 mb-2 ml-2">
          {" "}
          {/* <Chip color="blue" variant="ghost" value="Original Image" /> */}
          Original Image{" "}
        </div>

        {/* <Input onChange={(e) => setStOriginalImage(e.target.value)} type="file" name="" id="" accept="image/*" /> */}
        <div className="mb-4 rounded-md">
          <input
            className="mb-2 ml-2"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
          />
          <div className="flex justify-center "> OR </div>
          <MatButton
            disabled={!fastPreview[0]}
            size="sm"
            color="deep-purple"
            variant="outlined"
            className="mt-4 p-2"
            fullWidth
            onClick={fnUseThisCanvas}
          >
            Use this Canvas
          </MatButton>
          {uploadedImg && (
            <div className="flex justify-center">
              <img
                className="m-2 rounded-md h-32 w-full object-contain"
                // src={`data:image/jpeg;base64, ${uploadedImg}`}
                src={uploadedImg}
                alt="Uploaded Image"
              />
            </div>
          )}
        </div>

        <Textarea
          required
          color="deep-purple"
          label="Prompt"
          onChange={(e) => setStImgPrompt(e.target.value)}
        />

        <MatButton
          disabled={!uploadedImg}
          className="mt-4 w-full"
          onClick={fnCallInstructImgAPI}
        >
          Generate
          <img className="h-4 -mt-1 ml-2" src={coinImg} alt="" />
        </MatButton>

        {!responseImage && !clicked && (
          <div className="mt-4 text-center text-md text-green-600">
            {stDisplayMessage}
          </div>
        )}

        {!responseImage && clicked && (
          <div className="mt-0 text-center text-blue-600">
            <Lottie animationData={animationData} className="h-64" />
            {/* Generating Image... */}
          </div>
        )}

        {/* { responseImage && <img className="mt-4" src={`data:image/jpeg;base64, ${responseImage}`} alt="" /> } */}
        {responseImage && !clicked && (
          <div className="mt-4 h-32">
            <CustomImageComponent
              // preview={`data:image/jpeg;base64, ${responseImage}`} // if base64 Response
              preview={`${responseImage}`}
            />
          </div>
        )}
      </div>
    </>
  );
};

const AIImagePanel = () => {
  const [currentTab, setCurrentTab] = useState("prompt");

  const tabsArray = ["prompt", "instruct"];

  return (
    <div className="h-full">
      <Tabs
        id="custom-animation"
        className="overflow-y-auto h-full"
        value={currentTab}
      >
        <TabsHeader>
          {tabsArray.map((tab, index) => (
            <Tab key={index} value={tab} onClick={() => setCurrentTab(tab)}>
              <div className="appFont">{firstLetterCapital(tab)}</div>
            </Tab>
          ))}
        </TabsHeader>

        <TabsBody className="h-full">
          <div className="p-2"></div>
          {currentTab === "prompt" && <CompSearch isPanel={true} />}
          {currentTab === "instruct" && <CompInstructImage />}
        </TabsBody>
      </Tabs>
    </div>
  );
};

// define the new custom section
const AIImageSection = {
  name: "AIImage",
  Tab: (props) => (
    <SectionTab name="AI Image" {...props}>
      <AIIcon />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: AIImagePanel,
};

export default AIImageSection;
