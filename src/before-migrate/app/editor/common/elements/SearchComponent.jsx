import React from "react";
import { Button } from "@blueprintjs/core";
import InputBox from "./InputBox";
import { XCircleIcon } from "@heroicons/react/24/outline";

const SearchComponent = ({
  query,
  setQuery,
  onClick,
  placeholder,
  error,
  funtion,
  btnIcon,
}) => {
  return (
    <div className="flex flex-col justify-between gap-2 my-4 mx-0 ">
      <div className="flex flex-row justify-between gap-2 mx-1">
        <div className="relative w-full">
          <InputBox
            // placeholder={placeholder || "Search"}
            label={placeholder || "Search"}
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            funtion={funtion}
          />
          <XCircleIcon
            className="h-6 w-6 cursor-pointer absolute right-2 top-2"
            color="red"
            onClick={() => setQuery("")}
          />
        </div>
        {onClick && (
          <Button
            icon={btnIcon || "search"}
            className="outline-none"
            onClick={onClick}
          ></Button>
        )}
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default SearchComponent;
