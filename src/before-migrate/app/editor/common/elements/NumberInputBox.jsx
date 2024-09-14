import { Input } from "@material-tailwind/react";
import React from "react";

const NumberInputBox = ({
  label,
  value,
  onChange,
  placeholder,
  className,
  min,
  max,
  step,
  name,
  onFocus,
  autoFocus,
}) => {
  return (
    <Input
      type="number"
      min={min}
      max={max}
      step={step}
      name={name}
      className={className}
      label={label}
      placeholder={placeholder}
      onChange={onChange}
      onFocus={onFocus}
      value={value}
      containerProps={{ className: "min-w-[56px]" }} // To override min width from material
      autoFocus={autoFocus}
    />
  );
};

export default NumberInputBox;
