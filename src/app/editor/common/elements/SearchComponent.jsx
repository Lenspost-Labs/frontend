import React from "react";
import { Button } from "@blueprintjs/core";
import InputBox from "./InputBox";

const SearchComponent = ({
  query,
  setQuery,
  onClick,
  placeholder,
  error,
  funtion,
}) => {
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
            icon="refresh"
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
