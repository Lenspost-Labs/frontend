import React, { useContext, useState } from "react";
import { SharePanelHeaders } from "../components";
import { Tabs, Tab, TabsHeader, Textarea } from "@material-tailwind/react";
import { FarcasterNormalPost, FarcasterSmartPost } from "./components";
import { Context } from "../../../../../../providers/context";
import { useAppUrl } from "../../../../../../hooks/app";
import { ERC1155Edition } from "../zora-mint/components";

const FarcasterShareWrapper = () => {
  const { farcasterTab, setFarcasterTab, isMobile } = useContext(Context);
  const { urlQueryActionType : actionType } = useAppUrl();
  return (
    <>
      <SharePanelHeaders
        menuName={"farcasterShare"}
        panelHeader={"How do you want to share?"}
        panelContent={
          <>
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
                      Normal{" "}
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
                        ERC 1155{" "}
                      </Tab>
                    )}
                  </TabsHeader>
                </>
              {/* )} */}

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
