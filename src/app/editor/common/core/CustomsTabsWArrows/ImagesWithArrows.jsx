// --------
// This is a custom horizontal scroller component
// Params to pass: `arrImages` is an object array of images to be displayed in the scroller,
// The object specific destructuring is to be done Ex: `arrImages.img` for Image, `arrImages.json` for JSON
// `propWidth` - width of the Image
// --------

import React, { useContext, useRef, useState } from "react";
import "./styles/index.css";
import CustomImageComponent from "../CustomImageComponent";
import BsChevronLeft from "@meronex/icons/bs/BsChevronLeft";
import BsChevronRight from "@meronex/icons/bs/BsChevronRight";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getAssetByQuery } from "../../../../../services";
import { Context } from "../../../../../providers/context";

const ImagesWithArrows = ({ imagesArr }) => {
  const { isMobile, setOpenLeftBar, openLeftBar } = useContext(Context);
  const scrollWrapperRef = useRef(null);

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

  return (
    <>
      <div className="sectionWrapperImg">
        {/* Left and Right Buttons */}
        <div className="btnsWrapperImg" id="new">
          <div onClick={fnScrollLeft} id="button-left">
            {" "}
            <BsChevronLeft />{" "}
          </div>
          <div onClick={fnScrollRight} id="button-right">
            {" "}
            <BsChevronRight />{" "}
          </div>
        </div>

        {/* Images Inside the Horizontal scroller */}
        <div id="outsiderImg" ref={scrollWrapperRef}>
          <div className="divsWrapper" id="insiderImg">
            {imagesArr.map((item, index) => {
              return (
                <div
                  id={index}
                  className="eachDiv"
                  onClick={() => {
                    if (isMobile) {
                      setOpenLeftBar(!openLeftBar);
                    }
                  }}
                >
                  {" "}
                  <CustomImageComponent
                    imgClassName={"object-cover w-48"}
                    preview={item}
                  />{" "}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default ImagesWithArrows;
