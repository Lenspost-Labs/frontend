import React, { useContext, useEffect, useState } from "react";
import { Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import { Input, Button, Typography } from "@material-tailwind/react";
import BsX from "@meronex/icons/bs/BsX";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "../../../../../../../../services/apis/BE-apis/backendApi";
import { Context } from "../../../../../../../../providers/context";
import {
  getProfileImage,
  getTop5SocialDetails,
} from "../../../../../../../../services";
import { useAccount, useWalletClient } from "wagmi";
import { Top5ProfileCard } from "../../Cards";

// XMTP
import { Client } from "@xmtp/xmtp-js";
// import "../../../../../../../../../polyfills";

const InviteModal = () => {
  const { address } = useAccount();
  const { openedProfileModal, setOpenedProfileModal } = useContext(Context);
  const [formData, setFormData] = useState({});
  const [top5Users, setTop5Users] = useState([]);
  const [loading, setLoading] = useState(false);
  const { data: walletClient, isError, isLoading } = useWalletClient();
  const [xmtpSendAddr, setXmtpSendAddr] = useState("");

  // const { data: signer, isError, isLoading } = useSigner()

  const userAddresses = [];
  const userProfileNames = [];
  const userProfileImages = [];

  // XMPT - START
  // Create a client
  let xmtp = null;
  //Fabri wallet
  let WALLET_TO = "0x3F11b27F323b62B159D2642964fa27C46C841897";
  let conversation = null;

  // 0xE3811DeFd98AF92712e54b0b3E1735c1051C86D6

  async function create_a_client() {
    if (!walletClient) {
      console.log("Wallet is not initialized");
      return;
    }

    xmtp = await Client.create(walletClient, { env: "dev" });
    console.log("Client created", xmtp.address);
  }

  //Check if an address is on the network
  async function check_if_an_address_is_on_the_network() {
    //Message this XMTP message bot to get an immediate automated reply:
    // gm.xmtp.eth (0x937C0d4a6294cdfa575de17382c7076b579DC176) 
    //

    if (xmtp) {
      const isOnDevNetwork = await xmtp.canMessage(WALLET_TO);
      console.log(`Can message: ${isOnDevNetwork}`);
      return isOnDevNetwork;
    }
    return false;
  }

  //Start a new conversation
  async function start_a_new_conversation() {
    const canMessage = await check_if_an_address_is_on_the_network();
    if (!canMessage) {
      console.log("Address is not on the network");
      return;
    }

    if (xmtp) {
      conversation = await xmtp.conversations.newConversation(WALLET_TO);
      console.log(conversation)
      console.log(`Conversation created with ${conversation.peerAddress}`);
    }
  }

  //Send a message
  async function send_a_message() {
    if (conversation) {
      const message = await conversation.send("GM Builders");
      console.log(`Message sent: "${message.content}"`);
      return message;
    }
  }

  // Send a message to XMTP
  const fnSendXmtpMessage = async () => {
    await start_a_new_conversation()
    const res = await send_a_message();
    console.log(res);
  };

  // XMPT - END

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    if (name === "xmtpSendAddr") setXmtpSendAddr(value);
  };

  const fnGetTop5Interactions = async () => {
    setLoading(true);
    const res = await getTop5SocialDetails({ address: ["0x983d6466FAC5B2aFe57e070283a4932A1bd0508F"] });

    // console.log(res);
    // res?.SocialFollowers?.Follower[0].followerAddress.socials[0].userAssociatedAddresses[0]

    if (res && res.SocialFollowers && res.SocialFollowers.Follower) {
      res.SocialFollowers.Follower.forEach((follower) => {
        if (follower.followerAddress && follower.followerAddress.socials) {
          follower.followerAddress.socials.forEach((social) => {
            if (social.userAssociatedAddresses && social.dappName === "lens") {
              userProfileNames.push(social.profileName);
              userAddresses.push(social.userAssociatedAddresses[0]);

              if (social.profileImageContentValue?.image === null) {
                userProfileImages.push("");
              } else {
                userProfileImages.push(
                  social?.profileImageContentValue?.image?.small
                );
              }
            }
          });
        }
      });
    }

    const users = userAddresses.map((address, index) => ({
      userAddress: address,
      userProfileName: userProfileNames[index] || "username", // Default username
      userProfileImage: userProfileImages[index] || "", // Default empty
    }));

    if (users.length > 5) users.splice(5, users.length - 5);
    setTop5Users(users);
    console.log(users);

    setLoading(false);
  };

  useEffect(() => {
    fnGetTop5Interactions();
    create_a_client();

    // fnCreateXMTPClient();
    // fnNewConversation();
  }, []);

  return (
    <>
      <Dialog
        className=" w-4/6"
        isOpen={openedProfileModal}
        canEscapeKeyClose="true"
        canOutsideClickClose="true"
      >
        <DialogBody className="m-2 p-2">
          <div className="flex justify-between">
            <Typography className="mb-4" variant="h4">
              Invite a friend
            </Typography>

            <BsX
              size="24"
              className="cursor-pointer mt-1"
              onClick={() => setOpenedProfileModal(!openedProfileModal)}
            />
          </div>

          {/* <div className="mt-2 mb-2">
            {" "}
            Choose a friend or input a Wallet Address to share an Invite{" "}
          </div> */}

          <div className="m-2 mt-4 w-fit bg-gray-200 p-1 pl-4 pr-4 rounded-full">
            {" "}
            Recommended friends based on your onchain activity {""}
          </div>

          {loading && (
            <div className="flex justify-center m-8"> Loading... </div>
          )}

          {!loading && (
            <div className="flex flex-wrap">
              {top5Users.map((user, index) => (
                <Top5ProfileCard
                  profileAddress={user.userAddress}
                  profileName={user.userProfileName.split("lens/")[1]}
                  profileImg={user.userProfileImage}
                />
              ))}
            </div>
          )}
          <div className="flex justify-center m-8"> -- OR -- </div>

          <div className="mt-2">
            <Input
              label="Wallet Address"
              name="xmtpSendAddr"
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="mt-4 text-right">
            <Button
              onClick={() => fnSendXmtpMessage()}
              color="indigo"
              // size="sm"
            >
              {" "}
              Confirm{" "}
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default InviteModal;
