import React from "react";
import Logo from "../logo/Logo";
import ShareButton from "../share/ShareButton";
import Toolbar from "polotno/toolbar/toolbar";
import { useStore } from "../../../../../hooks/polotno";

const NewTopbar = () => {
  const store = useStore();
  return (
    <>
      <div className="flex justify-between bg-white mb-2 w-full px-4 py-2">
        <Logo propHeight={72} propWidth={72} />
        <ShareButton />
      </div>
    </>
  );
};

export default NewTopbar;
