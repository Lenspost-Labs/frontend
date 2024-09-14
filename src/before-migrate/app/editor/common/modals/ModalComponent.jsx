// --------
// This is the Modal component Reference : https://blueprintjs.com/docs/#core/components/dialog
// Params: store(built-in), json - if needed(else ignore), ModalTitle, ModalMessage, onClickFunction (call it as an arrow callback function )
// Input fields and customBtn is displayed if `tokengatingIp` & `customBtn` is set to TRUE by the calling Component
// --------

import { Dialog, DialogBody, DialogFooter, Button } from "@blueprintjs/core";
import { handleChange } from "../../sections/left-section/design/utils";
import InputBox from "../elements/InputBox";
import { gatedWith } from "../../sections/left-section/template/utils";

// Dialog / Modal component start
const CompModal = ({
  icon,
  ModalTitle,
  ModalMessage,
  customBtn,
  tokengatingIp,
  onClickFunction,
  modal,
  setModal,
}) => {
  return (
    <Dialog
      title={ModalTitle}
      icon={`${icon ? icon : "issue"}`}
      canOutsideClickClose={true}
      isOpen={modal?.isOpen}
      onClose={() => {
        if (modal?.isTokengated) {
          setModal({
            isOpen: false,
            isTokengated: false,
            gatedWith: "",
            isNewDesign: false,
            json: null,
          });
        } else {
          setModal({
            isOpen: false,
            isTokengate: false,
            isNewDesign: false,
            stTokengateIpValue: "",
            isError: false,
            errorMsg: "",
            canvasId: null,
          });
        }
      }}
    >
      <DialogBody>
        {ModalMessage}

        {/* if tokengated */}
        {modal?.isTokengated &&
          gatedWith(modal).map((item, index) => (
            <p
              key={index}
              onClick={() => window.open(item, "_blank")}
              className="cursor-pointer w-full my-3 truncate text-base"
            >
              {item}
            </p>
          ))}
        {/* if tokengated */}

        {/* for tokengating */}
        {modal?.isTokengate && (
          <div className="my-3">
            <InputBox
              value={modal?.stTokengateIpValue}
              onChange={(e) => handleChange(e, modal, setModal)}
              placeholder={tokengatingIp}
            />

            {modal?.isError && (
              <p className="text-red-500">{modal?.errorMsg}</p>
            )}
          </div>
        )}
        {/* for tokengating */}
      </DialogBody>

      <DialogFooter
        actions={
          <div>
             {/* {!modal?.isTokengate && !modal?.isNewDesign && (
              <>
                <Button intent="danger" text="Yes" onClick={onClickFunction} />
                <Button
                  text="No"
                  onClick={() => {
                    setModal({
                      isOpen: false,
                      isTokengate: false,
                      isNewDesign: false,
                      stTokengateIpValue: "",
                      isError: false,
                      errorMsg: "",
                      canvasId: null,
                    });
                  }}
                />
              </>
            )} */}

            {/* for new designs */}
            {modal?.isNewDesign && (
              <>
                <Button intent="danger" text="Yes" onClick={onClickFunction} />
                <Button
                  text="No"
                  onClick={() => {
                    setModal({
                      isOpen: false,
                      isTokengate: false,
                      isNewDesign: false,
                      stTokengateIpValue: "",
                      isError: false,
                      errorMsg: "",
                      canvasId: null,
                    });
                  }}
                />
              </>
            )}
            {/* for new designs */}

            {/* for tokengating */}
            {modal?.isTokengate && (
              <Button
                disabled={modal?.isError || modal?.stTokengateIpValue === ""}
                className="px-8"
                intent="primary"
                text={customBtn}
                onClick={onClickFunction}
              />
            )}
            {/* for tokengating */}
          </div>
        }
      />
    </Dialog>
  );
};

export default CompModal;
