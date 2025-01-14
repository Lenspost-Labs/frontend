import React, { useContext, useEffect, useRef, useState } from "react";
import { SharePanelHeaders } from "../components";
import { Tabs, Tab, TabsHeader, Textarea } from "@material-tailwind/react";
import { FarcasterNormalPost, FarcasterSmartPost } from "./components";
import { Context } from "../../../../../../providers/context";
import { useAppUrl } from "../../../../../../hooks/app";
import { ERC1155Edition } from "../zora-mint/components";
import EmojiPicker, { EmojiStyle, Emoji } from "emoji-picker-react";
import { InputBox } from "../../../../common";

const FarcasterShareWrapper = () => {
  const {
    setPostName,
    postName,
    postDescription,
    setPostDescription,
    stCalendarClicked,
    setStCalendarClicked,
    farcasterTab,
    setFarcasterTab,
    actionType,
    isMobile,
  } = useContext(Context);

  const emojiPickerRef = useRef(null);
  const [stClickedEmojiIcon, setStClickedEmojiIcon] = useState(false);
  const [charLimitError, setCharLimitError] = useState("");
  //const { urlQueryActionType: actionType } = useAppUrl()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target)
      ) {
        setStClickedEmojiIcon(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to handle emoji click
  // Callback sends (data, event) - Currently using data only
  function fnEmojiClick(emojiData) {
    setPostDescription(postDescription + emojiData?.emoji); //Add emoji to description
  }

  const handleInputChange = (e) => {
    const value = e.target.value;
    const name = e.target.name;
    const maxByteLimit = 195;
    const byteLength = new TextEncoder().encode(value).length;

    if (name === "title") {
      setPostName(value);
      if (isMobile) {
        setPostName("Default Title");
      }
    } else if (name === "description") {
      if (byteLength > maxByteLimit) {
        setCharLimitError("Maximun character limit exceeded");
        setPostDescription(
          value.substring(0, value.length - (byteLength - maxByteLimit))
        );
      } else {
        setCharLimitError("");
        setPostDescription(value);
      }
    }
  };
  return (
    <>
      <SharePanelHeaders
        menuName={"farcasterShare"}
        panelHeader={"How do you want to share?"}
        panelContent={
          <>
            <div className="relative mt-0 pt-1 pb-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between"></div>
                {/* <InputBox
              label={"Title"}
              name="title"
              autoFocus={true}
              onChange={(e) => handleInputChange(e)}
              value={postName}
            /> */}
                <div className="space-x-2">
                  {!isMobile && (
                    <div className="flex flex-col gap-2">
                      <InputBox
                        label="Title"
                        name="title"
                        onChange={(e) => handleInputChange(e)}
                        value={postName}
                        // placeholder="Write a description..."
                      />
                      <Textarea
                        label="Description"
                        name="description"
                        onChange={(e) => handleInputChange(e)}
                        value={postDescription}
                        // placeholder="Write a description..."
                        // className="border border-b-4 w-full h-40 mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
                      />
                      {charLimitError && (
                        <div className="text-red-500 text-sm">
                          {charLimitError}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Using default textarea from HTML to avoid unnecessary focus only for mobile */}
                  {/* iPhone issue */}
                  {isMobile && actionType !== "composer" && (
                    <>
                      {/* <InputBox
                        label="Title"
                        name="title"
                        onChange={(e) => handleInputChange(e)}
                        value={postName}
                        // placeholder="Write a description..."
                      /> */}
                      <textarea
                        cols={30}
                        type="text"
                        className="border border-b-2 border-blue-gray-700 w-full mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
                        label="Description"
                        name="description"
                        onChange={(e) => handleInputChange(e)}
                        value={postDescription}
                        placeholder="Write a description..."
                        // className="border border-b-4 w-full h-40 mb-2 text-lg outline-none p-2 ring-0 focus:ring-2 rounded-lg"
                      />
                      {charLimitError && (
                        <div className="text-red-500 text-sm">
                          {charLimitError}
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex flex-row">
                    {/* Open the emoji panel - 22Jul2023 */}
                    {/* Dynamic Emoji on the screen based on click */}

                    <button
                      title="Open emoji panel"
                      className={`"rounded-md ${stClickedEmojiIcon && "pt-1"}"`}
                      onClick={(event) => {
                        event.stopPropagation();
                        setStClickedEmojiIcon(!stClickedEmojiIcon);
                      }}
                    >
                      <Emoji
                        unified={stClickedEmojiIcon ? "274c" : "1f60a"}
                        emojiStyle={EmojiStyle.NATIVE}
                        size={22}
                      />
                    </button>
                    <div
                      onClick={() => {
                        setStCalendarClicked(!stCalendarClicked);
                        setStShareClicked(true);
                      }}
                      className=" py-2 rounded-md cursor-pointer"
                    >
                      {/* <MdcCalendarClock className="h-10 w-10" /> */}
                    </div>
                  </div>

                  {/* Emoji Implementation - 21Jul2023 */}
                  {stClickedEmojiIcon && (
                    <div
                      className="shadow-lg mt-2 absolute z-40"
                      ref={emojiPickerRef}
                    >
                      <EmojiPicker
                        onEmojiClick={fnEmojiClick}
                        autoFocusSearch={true}
                        // width="96%"
                        className="m-0"
                        lazyLoadEmojis={true}
                        previewConfig={{
                          defaultCaption: "Pick one!",
                          defaultEmoji: "1f92a", // 🤪
                        }}
                        searchPlaceHolder="Search"
                        emojiStyle={EmojiStyle.NATIVE}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Tabs for Smart Post / Normal */}
            <Tabs className="overflow-scroll my-2" value={farcasterTab}>
              {/* Don't show Tabs header for Composer */}
              {/* {!actionType === "composer" && ( */}
              <>
                <TabsHeader className="relative top-0 ">
                  <Tab
                    value={"normalPost"}
                    className="appFont"
                    onClick={() => setFarcasterTab("normalPost")}
                  >
                    {" "}
                    Quick Share{" "}
                  </Tab>
                  {!isMobile && (
                    <Tab
                      value={"smartPost"}
                      className="appFont"
                      onClick={() => setFarcasterTab("smartPost")}
                    >
                      {" "}
                      Smart Post{" "}
                    </Tab>
                  )}
                  {isMobile && (
                    <Tab
                      value={"erc1155"}
                      className="appFont"
                      onClick={() => setFarcasterTab("erc1155")}
                    >
                      {" "}
                      Open Edition{" "}
                    </Tab>
                  )}
                </TabsHeader>
              </>
              {/* add components */}
              {farcasterTab === "normalPost" && <FarcasterNormalPost />}

              {farcasterTab === "smartPost" && <FarcasterSmartPost />}
              {farcasterTab === "erc1155" && <ERC1155Edition />}
            </Tabs>
          </>
        }
      />
    </>
  );
};

export default FarcasterShareWrapper;
