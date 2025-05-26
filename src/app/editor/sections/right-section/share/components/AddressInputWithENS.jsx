import React, { useState } from "react";
import { useEnsFromAddress } from "../../../../../../hooks/useEnsFromAddress";
import { InputBox } from "../../../../common";

export default function AddressInputWithENS({ value, onChange, ...rest }) {
  const { ensName, isLoading } = useEnsFromAddress(value);
  const [isFocused, setIsFocused] = useState(false);

  const displayValue = isFocused || isLoading || !ensName ? value : ensName;

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <InputBox
      {...rest}
      value={displayValue}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={onChange}
    />
  );
}
