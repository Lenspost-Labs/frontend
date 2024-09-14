// import { Switch } from "@material-tailwind/react";
import React, { useContext } from "react";
import { Switch } from "@headlessui/react";
import { Context } from "../../../../../../providers/context";

const SwitchGroup = ({ switchHead, switchDesc, mintOption }) => {
  const { enabled, setEnabled } = useContext(Context);

  return (
    <div className="mb-4 m-4">
      <div className="flex justify-between">
        <h2 className="text-lg mb-2"> {switchHead} </h2>
        <Switch
          color="yellow"
          className={"bg-[#e1f16b] text-black"}
          // defaultChecked
          onClick={() => {
            console.log("Clicked")
            console.log( mintOption )
            setEnabled({ mintOption  : !mintOption })
          }
        }
        />
      </div>
      <div className="w-4/5 opacity-75"> {switchDesc} </div>
    </div>
  );
};

export default SwitchGroup;
