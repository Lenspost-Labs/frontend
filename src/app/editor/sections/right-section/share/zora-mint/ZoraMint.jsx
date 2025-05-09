import React, { useContext } from "react";
import { SharePanelHeaders } from "../components";
import { Context } from "../../../../../../providers/context";
import {
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  Typography,
} from "@material-tailwind/react";
import { ERC1155Edition, ERC721Edition, LP721Edition } from "./components";
import { LP721SupportedChains } from "../../../../../../data";

const ZoraMint = ({ selectedChainId }) => {
  const { zoraTab, setZoraTab, menu } = useContext(Context);
  return (
    <>
      <SharePanelHeaders
        menuName={"zoraMint"}
        panelHeader={"Mint Options"}
        panelContent={
          <>
            <Tabs className="overflow-y-auto my-2" value={zoraTab}>
              {/* <TabsHeader className="relative top-0 ">
                <Tab
                  value={"ERC721"}
                  className="appFont"
                  onClick={() => setZoraTab("ERC721")}
                >
                  {" "}
                  ERC721{" "}
                </Tab>
                <Tab value={"ERC1155"} onClick={() => setZoraTab("ERC1155")}>
                  {" "}
                  ERC1155{" "}
                </Tab>
              </TabsHeader> */}

              {/* add components */}
              {typeof menu === "number" && (
                <LP721Edition
                  isOpenAction={false}
                  isFarcaster={false}
                  selectedChainId={selectedChainId}
                />
              )}

              {zoraTab === "ERC1155" && <ERC1155Edition />}
            </Tabs>
          </>
        }
      />
    </>
  );
};

export default ZoraMint;
