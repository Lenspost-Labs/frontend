import React, { useContext } from "react";
import { Button } from "@blueprintjs/core";
import InputBox from "./InputBox";
import { IconButton } from "@material-tailwind/react";
import { Context } from "../../../../providers/context/ContextProvider";
import BsSearch from "@meronex/icons/bs/BsSearch";

const SearchComponent = ({
  query,
  setQuery,
  onClick,
  placeholder,
  error,
  funtion,
  btnIcon,
}) => {
  const { isMobile } = useContext(Context);
  return (
    <div className="flex flex-col justify-between gap-2 my-4 mx-0 ">
      <div className="flex flex-row justify-between gap-2 mx-1">
        <InputBox
          // placeholder={placeholder || "Search"}
          label={placeholder || "Search"}
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          funtion={funtion}
        />
        {onClick && (
          <Button
            icon={btnIcon || "search"}
            className="outline-none"
            onClick={onClick}
          ></Button>
        )}
        {/* {isMobile && on && (
          <div
            onClick={onClick}
            className="p-3 cursor-pointer rounded-lg border hover:bg-gray-100"
          >
            <BsSearch />
          </div>
        )} */}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default SearchComponent;
