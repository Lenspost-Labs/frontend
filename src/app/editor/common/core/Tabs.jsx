import React, { useEffect, useRef, useState } from "react";
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
import { fnLoadMore } from "../../../../utils";
import { useAppAuth } from "../../../../hooks/app";

// `changeCanvasDimension` is True/False from the Passing Component
const Tabs = ({
  defaultQuery,
  campaignName,
  author,
  getAssetsFn,
  type,
  changeCanvasDimension,
  showOnlyIfIp = false,
}) => {
  const { isAuthenticated } = useAppAuth();
  const [query, setQuery] = useState("");
  const [delayedQuery, setDelayedQuery] = useState(query);
  const requestTimeout = useRef();

  const {
    data,
    isLoading,
    isError,
    error,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: [type, author, campaignName, delayedQuery],
    getNextPageParam: (prevData) => prevData?.nextPage,
    queryFn: ({ pageParam = 1 }) =>
      delayedQuery
        ? getAssetsFn(type, delayedQuery, "", pageParam)
        : author || campaignName
        ? getAssetsFn(type, author, campaignName, pageParam)
        : getAssetsFn(type, pageParam),
    enabled: isAuthenticated ? true : false,
  });

  useEffect(() => {
    requestTimeout.current = setTimeout(() => {
      setDelayedQuery(query);
    }, 1000);
    return () => {
      clearTimeout(requestTimeout.current);
    };
  }, [query]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fnLoadMore(hasNextPage, fetchNextPage);
  }, [hasNextPage, fetchNextPage]);

  if (!isAuthenticated) {
    return <ConnectWalletMsgComponent />;
  }

  // Show Loading - 06Jul2023
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
        placeholder={`Search ${
          changeCanvasDimension ? "Backgrounds" : "Stickers"
        }`}
      />

      {data?.pages[0]?.data.length > 0 ? (
        // <div className="h-full overflow-y-auto">
        // <div className="overflow-y-auto">
        // To Fix Lenspost Banner Preview size issue
        <div className="columns-2 gap-1">
          {data?.pages
            .flatMap((item) => item?.data)
            .map((item, index) => {
              //check for showOnlyIfIp
              if (showOnlyIfIp) {
                //check item for ip flag
                if (item?.isIp) {
                  return (
                    <CustomImageComponent
                      key={index}
                      item={item}
                      assetType={null}
                      collectionName={null}
                      preview={item?.image}
                      dimensions={item?.dimensions != null && item.dimensions}
                      hasOptionBtn={null}
                      onDelete={null}
                      isLensCollect={null}
                      changeCanvasDimension={changeCanvasDimension}
                      recipientWallet={item?.wallet}
                      showAuthor={campaignName === "halloween" ? true : false}
                      author={item?.author}
                    />
                  );
                } else {
                  return <></>;
                }
              } else {
                return (
                  <CustomImageComponent
                    key={index}
                    item={item}
                    assetType={null}
                    collectionName={null}
                    preview={item?.image}
                    dimensions={item?.dimensions != null && item.dimensions}
                    hasOptionBtn={null}
                    onDelete={null}
                    isLensCollect={null}
                    changeCanvasDimension={changeCanvasDimension}
                    recipientWallet={item?.wallet}
                    showAuthor={campaignName === "halloween" ? true : false}
                    author={item?.author}
                  />
                );
              }
            })}
          {/* </div> */}
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

export default Tabs;
