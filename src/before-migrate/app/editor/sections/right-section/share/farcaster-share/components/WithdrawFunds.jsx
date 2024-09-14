import { Button, Typography } from "@material-tailwind/react";
import { InputBox, NumberInputBox } from "../../../../../common";
import { useMutation } from "@tanstack/react-query";
import { withdrawFunds } from "../../../../../../../services/apis/BE-apis";
import { toast } from "react-toastify";
import { errorMessage } from "../../../../../../../utils";
import { useEffect, useState } from "react";

const WithdrawFunds = ({ refetchWallet }) => {
  const [address, setAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutateAsync } = useMutation({
    mutationKey: "withdraw-funds",
    mutationFn: withdrawFunds,
  });

  const handleWithdrawFunds = async () => {
    if (!amount) {
      toast.error("Amount is required");
      return;
    }
    if (!address) {
      toast.error("Recipient Address is required");
      return;
    }

    setIsLoading(true);

    mutateAsync({
      address: address,
      amount: amount,
    })
      .then((res) => {
        toast.success(res?.message || "Funds Withdrawn Successfully");
        setIsLoading(false);
        setIsSuccess(true);
        setAddress("");
        setAmount("");
      })
      .catch((err) => {
        console.log("err", err);
        toast.error(errorMessage(err));
        setIsLoading(false);
        setAddress("");
        setAmount("");
      });
  };

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        refetchWallet();
      }, 2000);
    }
  }, [isSuccess]);

  return (
    <div className="my-2 py-2 ">
      <div className="flex flex-col w-full gap-3">
        <Typography variant="h6" color="black">
          Withdraw Funds
        </Typography>
        <NumberInputBox
          label="Amount"
          min={1}
          name="amount"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
        />
        <InputBox
          label="Recipient Address"
          name="recipientAddress"
          onChange={(e) => setAddress(e.target.value)}
          value={address}
        />
        <div className="flex justify-end items-center">
          <Button
            size="sm"
            className="outline-none"
            onClick={handleWithdrawFunds}
            disabled={isLoading}
          >
            {isLoading ? "Withdrawing..." : "Withdraw"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawFunds;
