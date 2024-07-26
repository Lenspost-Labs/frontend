import React, { useContext } from "react";
import { Context } from "../../../../../providers/context";
import EditIconShare from "../../../../../assets/EditIconsMobile/EditIconShare";
import EditIconStickers from "../../../../../assets/EditIconsMobile/EditIconStickers";
import EditIconText from "../../../../../assets/EditIconsMobile/EditIconText";
import EditIconUpload from "../../../../../assets/EditIconsMobile/EditIconUpload";

const MobileNavbar = () => {
  const { curOpenedPanel, setCurOpenedPanel } = useContext(Context);

  return (
    <>
    <div className="flex justify-between align-middle mx-6 my-2">

      <EditIconUpload />
      <EditIconStickers />
      <EditIconText />
      <EditIconShare />
    </div>
    </>
  );
};

export default MobileNavbar;
