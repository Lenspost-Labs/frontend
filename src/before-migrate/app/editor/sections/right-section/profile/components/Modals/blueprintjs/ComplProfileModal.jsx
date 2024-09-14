import React, { useContext, useState } from "react";
import { Dialog, DialogBody, DialogFooter } from "@blueprintjs/core";
import { Input, Button, Typography } from "@material-tailwind/react";
import BsX from "@meronex/icons/bs/BsX";
import { useMutation } from "@tanstack/react-query";
import { updateUserProfile } from "../../../../../../../../services/apis/BE-apis/backendApi";
import { Context } from "../../../../../../../../providers/context";

const ComplProfileModal = ({ modalHead, modalSubHead }) => {
  // const [openedProfileModal, setOpenedProfileModal] = useState(opened);
  const { openedProfileModal, setOpenedProfileModal } = useContext(Context);
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value });
  };

  const updateProfile = async () => {
    const res = await updateUserProfile(formData);
  };

  return (
    <>
      <Dialog
        isOpen={openedProfileModal}
        canEscapeKeyClose="true"
        canOutsideClickClose="true"
      >
        <DialogBody className="m-2 p-2">
          <div className="flex justify-between">
            <Typography className="mb-4" variant="h4">
              {/* Complete your Profile */}
              {modalHead}
            </Typography>

            <BsX
              className="cursor-pointer mt-1"
              size="24"
              onClick={() => setOpenedProfileModal(!openedProfileModal)}
            />
          </div>

          <div className="mt-2">
            {" "}
            {/* Please provide your Username and Email to complete your profile */}
            {modalSubHead}{" "}
          </div>
          <div className="mt-4">
            <Input
              label="Username"
              name="username"
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="mt-4">
            <Input
              label="Email"
              name="mailId"
              onChange={(e) => handleChange(e)}
            />
          </div>

          <div className="mt-6">
            <Button fullWidth color="" onClick={updateProfile} size="sm">
              {" "}
              Confirm{" "}
            </Button>
          </div>
        </DialogBody>
      </Dialog>
    </>
  );
};

export default ComplProfileModal;
