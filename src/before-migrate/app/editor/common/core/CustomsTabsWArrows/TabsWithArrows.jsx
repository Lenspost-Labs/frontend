// --------
// This is a custom horizontal scroller component for Tabs
// Params to pass: `tabsHeaders` <TabsHeader/> component from material-tailwind-react 
// --------

import React, { useEffect, useRef, useState } from "react";
import "./styles/index.css";
import BsChevronLeft from "@meronex/icons/bs/BsChevronLeft";
import BsChevronRight from "@meronex/icons/bs/BsChevronRight";

const TabsWithArrows = ({ tabsHeaders }) => {
  const scrollWrapperRef = useRef(null);

  const disableLeftBtn = scrollWrapperRef.current;
  const distance = 300;

  const fnScrollLeft = () => {
    scrollWrapperRef.current.scrollBy({
      left: -distance,
      behavior: "smooth",
    });
  };
  const fnScrollRight = () => {
    scrollWrapperRef.current.scrollBy({
      left: distance,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    // console.log("scrollWrapperRef.current", scrollWrapperRef.current.scrollBy);

    // console.log("disableLeftBtn", disableLeftBtn);

  }, []);

  return (
    <>
      <div className="sectionWrapperTabs">
        {/* Left and Right Buttons */}
        <div className="flex align-middle justify-center" id="new">
          
          <div onClick={fnScrollLeft}  id="button-left">
            {" "}
            <BsChevronLeft />{" "}
          </div>
          <div onClick={fnScrollRight} id="button-right">
            {" "}
            <BsChevronRight />{" "}
          </div>
        </div>

        {/* Images Inside the Horizontal scroller */}
        <div id="outsiderTabs" className="mx-9" ref={scrollWrapperRef}>
          <div className="divsWrapper " id="insiderTabs">
            {tabsHeaders}
          </div>
        </div>
      </div>
    </>
  );
};

export default TabsWithArrows;
