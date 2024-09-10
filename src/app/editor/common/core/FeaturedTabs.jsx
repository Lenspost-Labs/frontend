// --------
// This component is used to render the Featured assets: stickers/banners
// It is same as Tabs.jsx [ just to avoid random errors (Difference in BE Response) ] //11Sep2023
// --------

import React, { useEffect, useRef, useState } from "react";
import { Spinner } from "@blueprintjs/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAccount } from "wagmi";

import {
  ConnectWalletMsgComponent,
  CustomImageComponent,
  ErrorComponent,
  LoadMoreComponent,
  LoadingAnimatedComponent,
  MessageComponent,
  SearchComponent,
} from "..";
import { fnLoadMore, isLensHandle } from "../../../../utils";

// `changeCanvasDimension` is True/False from the Passing Component
const FeaturedTabs = ({
  defaultQuery,
  getAssetsFn,
  queryKey,
  changeCanvasDimension,
  isLensCollect,
}) => {
  const [query, setQuery] = useState("");
  const [delayedQuery, setDelayedQuery] = useState(query);
  const requestTimeout = useRef();
  const { isDisconnected, address } = useAccount();

  const [noOfCols, setNoOfCols] = useState(2);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [queryKey, delayedQuery || defaultQuery],
    getNextPageParam: (prevData) => prevData?.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      getAssetsFn(delayedQuery || defaultQuery, pageParam),
  });
  // To change the no of columns in the grid based on the queryKey
  // 1 - Featured BGs, 2 - Featured Stickers/Props
  useEffect(() => {
    if (queryKey === "stickers") {
      setNoOfCols(2);
    } else {
      setNoOfCols(1);
    }
  }, [queryKey]);

  useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query);
    }, 1000);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

  useEffect(() => {
    if (isDisconnected || !address) return;
    fnLoadMore(hasNextPage, fetchNextPage);
  }, [hasNextPage, fetchNextPage]);

  if (isDisconnected || !address) {
    return <ConnectWalletMsgComponent />;
  }

  if (isLoading) {
    return <LoadingAnimatedComponent />;
  }
  return isError ? (
    <ErrorComponent message={error} />
  ) : (
    <>
      <SearchComponent
        query={query}
        setQuery={setQuery}
        placeholder="Search backgrounds"
      />

      {data?.pages[0]?.data?.assets.length > 0 ? (
        <div className="h-full overflow-y-auto">
          <div className={`grid grid-cols-${noOfCols} overflow-y-auto`}>
            {data?.pages
              .flatMap((item) => item?.data.assets)
              .map((item, index) => {
                return (
                  <CustomImageComponent
                    key={index}
                    preview={item?.image}
                    featuredWallet={item?.wallet}
                    dimensions={item?.dimensions != null && item.dimensions}
                    changeCanvasDimension={changeCanvasDimension}
                  />
                );
              })}
          </div>
          <LoadMoreComponent
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
          />
        </div>
      ) : (
        <MessageComponent message="No results found" />
      )}
    </>
  );
};

export default FeaturedTabs;
