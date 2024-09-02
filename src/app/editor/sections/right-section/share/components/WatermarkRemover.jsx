import React, { useContext } from "react";
import BsDroplet from "@meronex/icons/bs/BsDroplet";
import { useStore } from "../../../../../../hooks/polotno";
import { useUser } from "../../../../../../hooks/user";
import { toast } from "react-toastify";
import { consoleLogonlyDev } from "../../../../../../utils";
import { claimReward } from "../../../../../../services";
import { Context } from "../../../../../../providers/context";
import { posterTokenSymbol } from "../../../../../../data";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const WatermarkRemover = () => {
  const store = useStore();
  const { points } = useUser();
  const { contextCanvasIdRef, setRemovedWMarkCanvas } = useContext(Context);

  consoleLogonlyDev("Store before watermark removed", store?.toJSON());

  const queryClient = useQueryClient();

  const { mutateAsync: mutClaimReward } = useMutation({
    mutationFn: async ({ taskId, canvasId }) => {
      try {
        const result = await claimReward({
          taskId: taskId,
          canvasId: canvasId,
        });

        // Refetch the user profile after successful claim
        await queryClient.invalidateQueries({ queryKey: ["userProfile"] });

        return result;
      } catch (error) {
        console.error("Error claiming reward:", error);
        throw error;
      }
    },
  });

  const fnRemoveWatermark = () => {
    toast?.loading("Removing watermark");
    if (!contextCanvasIdRef?.current) {
      toast.dismiss();
      toast.error(
        "Please remove watermark after adding something on the canvas"
      );
      return;
    }
    if (points < 5 || !points) {
      toast.dismiss();
      toast.error(`Not enough ${posterTokenSymbol} points`);
      return;
    }
    consoleLogonlyDev("Remove watermark called");
    consoleLogonlyDev(store?.toJSON());
    store.pages.forEach((page) => {
      page.children.forEach((child) => {
        if (child.name === "watermark") {
          // child.setProperties(
          //   (child) => {
          //     child.name = "watermark-removed";
          //   },
          // )

          store.deleteElements([child.id]);

          consoleLogonlyDev(child?.toJSON());
        }
      });
    });

    mutClaimReward({
      taskId: 1,
      canvasId: contextCanvasIdRef?.current,
    });
    setRemovedWMarkCanvas(contextCanvasIdRef?.current);
    consoleLogonlyDev("Store after watermark removed");
    consoleLogonlyDev(store?.toJSON());
    toast.dismiss();
    toast.success("Watermark removed successfully");
  };

  return (
    <div className="p-4 pt-0" onClick={() => fnRemoveWatermark()}>
      <div className="bg-[#6B7FF1] rounded-l-full rounded-r-md cursor-pointer hover:shadow-md hover:bg-[#6b7ff1f8]">
        <div className="flex justify-between items-center gap-2 p-2">
          <div className="text-white">
            <BsDroplet size="24" />
          </div>
          <div className="text-md text-white">
            Remove watermark with your {posterTokenSymbol} Tokens
          </div>
          <div className="text-sm bg-[#FFFFFF40] text-white p-1 px-2 rounded-l-full rounded-r-md">
            <span className="mr-2">5</span>
            <span>{posterTokenSymbol}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WatermarkRemover;
