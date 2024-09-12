const useAppUrl = () => {
  const url = new URL(window.location.href);
  const params = new URLSearchParams(url.search);
  const urlQueryActionType = params.get("actionType");
  const urlQueryAddress = params.get("address");
  const urlQueryFCAuth = params.get("fc-auth");
  const urlQueryFid = params.get("fid");


  return {
    urlQueryActionType,
    urlQueryAddress,
    urlQueryFCAuth,
    urlQueryFid
  };
};

export default useAppUrl;
