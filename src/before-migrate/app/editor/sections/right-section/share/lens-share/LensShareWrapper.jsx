import React, { useContext, useState } from "react";
import { SharePanelHeaders } from "../components";
import { Tabs, Tab, TabsHeader } from "@material-tailwind/react";
import { SmartPost, LensShare } from "./components";
import { Context } from "../../../../../../providers/context";

const LensShareWrapper = () => {
  const { lensTab, setLensTab } = useContext(Context);

  return (
    <>
      <SharePanelHeaders
        menuName={"share"}
        panelHeader={"Monetization Settings"}
        panelContent={
          <>
            {/* Tabs for Smart Post / Normal */}
            <Tabs className="overflow-scroll my-2" value={lensTab}>
              <TabsHeader className="relative top-0 ">
                <Tab
                  value={"normalPost"}
                  className="appFont"
                  onClick={() => setLensTab("normalPost")}
                >
                  {" "}
                  Normal{" "}
                </Tab>
                <Tab
                  value={"smartPost"}
                  className="appFont"
                  onClick={() => setLensTab("smartPost")}
                >
                  {" "}
                  Smart Post{" "}
                </Tab>
              </TabsHeader>

              {/* add components */}
              {lensTab === "normalPost" && <LensShare />}
              {lensTab === "smartPost" && <SmartPost />}
            </Tabs>
          </>
        }
      />
    </>
  );
};

export default LensShareWrapper;
