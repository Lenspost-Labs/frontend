import React, { useContext, useState } from "react";
import { SharePanelHeaders } from "../components";
import { Tabs, Tab, TabsHeader } from "@material-tailwind/react";
import { FarcasterNormalPost, FarcasterSmartPost } from "./components";
import { Context } from "../../../../../../providers/context";

const FarcasterShareWrapper = () => {
  const { farcasterTab, setFarcasterTab, isMobile,  } = useContext(Context);

  return (
    <>
      <SharePanelHeaders
        menuName={"farcasterShare"}
        panelHeader={"Monetization Settings"}
        panelContent={
          <>
            {/* Tabs for Smart Post / Normal */}
            <Tabs className="overflow-scroll my-2" value={farcasterTab}>
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
              </TabsHeader>

              {/* add components */}
              {farcasterTab === "normalPost" && <FarcasterNormalPost />}

              {farcasterTab === "smartPost" && <FarcasterSmartPost />}
            </Tabs>
          </>
        }
      />
    </>
  );
};

export default FarcasterShareWrapper;
