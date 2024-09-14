import React, { useState, useEffect } from "react";

const CheckInternetConnection = () => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnlineStatus = () => setIsOnline(true);
    const handleOfflineStatus = () => setIsOnline(false);

    window.addEventListener("online", handleOnlineStatus);
    window.addEventListener("offline", handleOfflineStatus);

    return () => {
      window.removeEventListener("online", handleOnlineStatus);
      window.removeEventListener("offline", handleOfflineStatus);
    };
  }, []);

  return (
    !isOnline && (
      <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-40">
        <div className="w-max h-max px-8 py-8 bg-white rounded-lg flex flex-col gap-5 items-center justify-center shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-black"></div>
          <h1 className="font-bold text-2xl text-black">
            No internet connection...!
          </h1>
        </div>
      </div>
    )
  );
};

export default CheckInternetConnection;
