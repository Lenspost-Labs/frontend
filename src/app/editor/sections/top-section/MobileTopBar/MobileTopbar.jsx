import Toolbar from "polotno/toolbar/toolbar";
import React, { useContext } from "react";
import { useStore } from "../../../../../hooks/polotno";
import EditIconLeft from "../../../../../assets/EditIconsMobile/EditIconLeft";
import { Context } from "../../../../../providers/context";
import { Drawer } from "@material-tailwind/react";
import EditIconRight from "../../../../../assets/EditIconsMobile/EditIconRight";
import Logo from "../logo/Logo";

const MobileTopbar = () => {
  const store = useStore();
  const { openLeftBar, setOpenLeftBar, curOpenedPanel, setCurOpenedPanel } =
    useContext(Context);

  return (
    <>
      <div className="flex items-center gap-2">
        <div
          onClick={() => setOpenLeftBar(!openLeftBar)}
          className="bg-white p-2 rounded-lg"
        >
          <EditIconLeft />
        </div>
        <Toolbar store={store} />
      </div>

      <Drawer
        size={Number(window && window?.innerWidth) || 0}
        placement="left"
        open={openLeftBar}
        onClose={() => setOpenLeftBar(!openLeftBar)}
        className=""
      >
        <div className="flex justify-between items-center">
          <Logo propHeight={16} />
          <div
            onClick={() => setOpenLeftBar(!openLeftBar)}
            className="bg-white p-2 rounded-lg"
          >
            <EditIconRight />
          </div>
        </div>
        {curOpenedPanel === "mobPanelUpload" && <> Test </>}
      </Drawer>
    </>
  );
};

export default MobileTopbar;
