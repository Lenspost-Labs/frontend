import React from "react";

const LoadMoreComponent = ({ hasNextPage, isFetchingNextPage }) => {
  return (
    <>
      {hasNextPage && (
        <div
          className="flex justify-center w-full h-10"
          id="bottom"
        >
          {isFetchingNextPage && "Loading more..."}
        </div>
      )}
    </>
  );
};

export default LoadMoreComponent;
