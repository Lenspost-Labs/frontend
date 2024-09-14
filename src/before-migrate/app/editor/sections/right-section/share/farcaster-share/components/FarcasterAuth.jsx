import { Button } from "@material-tailwind/react";
import React, { useContext } from "react";
import { NEYNAR_CLIENT_ID } from "../../../../../../../services";
import { errorMessage, saveToLocalStorage } from "../../../../../../../utils";
import { LOCAL_STORAGE } from "../../../../../../../data";
import { useMutation } from "@tanstack/react-query";
import { farUserRegister } from "../../../../../../../services/apis/BE-apis";
import { toast } from "react-toastify";
import { Context } from "../../../../../../../providers/context";

const FarcasterAuth = () => {
  const { setFarcasterStates, farcasterStates } = useContext(Context);
  var authWindow;
  const neynarLoginUrl = "https://app.neynar.com/login";
  const clientId = NEYNAR_CLIENT_ID;
  const redirectUri = "";

  const { mutateAsync } = useMutation({
    mutationKey: "farcasterAuth",
    mutationFn: farUserRegister,
  });

  const handleFarcasterAuth = (signer_uuid, fid, is_authenticated) => {
    mutateAsync({
      signer_uuid: signer_uuid,
      fid: fid,
    })
      .then((res) => {
        saveToLocalStorage(LOCAL_STORAGE.farcasterAuth, is_authenticated);
        setFarcasterStates({
          ...farcasterStates,
          isFarcasterAuth: is_authenticated,
        });
        toast.success("Successfully logged in to Farcaster");
      })
      .catch((err) => {
        console.log("err", err);
        toast.error(errorMessage(err));
      });
  };

  const successCallback = (data) => {
    handleFarcasterAuth(data?.signer_uuid, data?.fid, data?.is_authenticated);
  };

  const handleMessage = (event, authOrigin, successCallback) => {
    if (event?.origin === authOrigin && event?.data?.is_authenticated) {
      if (typeof successCallback === "function") {
        successCallback(event?.data); // Call the global callback function
      }

      if (authWindow) {
        authWindow.close();
      }

      window.removeEventListener("message", handleMessage);
    }
  };

  const handleSignIn = () => {
    var authUrl = new URL(neynarLoginUrl);
    authUrl.searchParams.append("client_id", clientId);
    if (redirectUri) {
      authUrl.searchParams.append("redirect_uri", redirectUri);
    }

    var authOrigin = new URL(neynarLoginUrl).origin;     
    authWindow = window.open(authUrl.toString(), "_blank");

    // get the data from the iframe
    window.addEventListener(
      "message",
      function (event) {
        handleMessage(event, authOrigin, successCallback);
      },
      false
    );
  };

  return (
    <div className="mx-2">
      <Button
        onClick={handleSignIn}
        className="w-full outline-none"
        // color="teal"
      >
        LogIn to Farcaster
      </Button>
    </div>
  );
};

export default FarcasterAuth;
