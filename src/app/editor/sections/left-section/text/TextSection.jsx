import React, { useContext } from "react";

import { SectionTab } from "polotno/side-panel";
import { Icon } from "@blueprintjs/core";
import { useStore } from "../../../../../hooks/polotno";
import { useQuery } from "@tanstack/react-query";
import { apiGetPolotnoTexts } from "../../../../../services";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { LoadingAnimatedComponent } from "../../../common";
import axios from "axios";
import useMobilePanelFunctions from "../../../common/mobileHooks/useMobilePanelFunctions";
import { Context } from "../../../../../providers/context";

export const CustomTextPanel = () => {
  const store = useStore();
  const { setOpenBottomBar } = useContext(Context);

  const { data: textsData } = useQuery({
    queryKey: ["text"],
    queryFn: apiGetPolotnoTexts,
  });

  const fnLoadText = async (jsonAPILink) => {
    try {
      const response = await axios.get(jsonAPILink);
      const textsJson = response.data;
      console.log(textsJson);

      if (
        textsJson &&
        textsJson.pages &&
        textsJson.pages[0] &&
        textsJson.pages[0].children
      ) {
        const newChildren = textsJson.pages[0].children;

        // Get the current JSON from the store
        const currentJSON = store.toJSON();

        // Create a new object with the updated children
        const updatedJSON = {
          ...currentJSON,
          pages: [
            {
              ...currentJSON.pages[0],
              children: [
                ...(currentJSON.pages[0]?.children || []),
                ...newChildren,
              ],
            },
            ...(currentJSON.pages.slice(1) || []),
          ],
        };

        // Load the updated JSON back into the store
        store.loadJSON(updatedJSON, true);
      } else {
        console.error("Invalid JSON structure: children array not found");
      }

      setOpenBottomBar(false);
    } catch (error) {
      console.error("Error loading text:", error);
    }
  };
  return (
    <>
      {!textsData && <LoadingAnimatedComponent />}
      <div className="grid grid-cols-2">
        {textsData &&
          textsData?.data?.items?.map((text) => (
            <div
              className=" border border-gray-200 rounded-lg p-2 m-2"
              onClick={() => fnLoadText(text?.json)}
            >
              <LazyLoadImage src={text?.preview} />
            </div>
          ))}
      </div>
    </>
  );
};

// define the new custom section
const TextSection = {
  name: "text",
  Tab: (props) => (
    <SectionTab name="Text" {...props}>
      <Icon icon="text" />
    </SectionTab>
  ),
  // we need observer to update component automatically on any store changes
  Panel: CustomTextPanel,
};

export default TextSection;
