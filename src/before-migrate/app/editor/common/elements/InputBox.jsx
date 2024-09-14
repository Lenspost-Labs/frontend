import { Input } from "@material-tailwind/react";
import React from "react";

const InputBox = ({
  label,
  value,
  onChange,
  placeholder,
  className,
  name,
  onFocus,
  onBlur,
  autoFocus,
  funtion,
}) => {
  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // Call your function here
      if (typeof funtion === "function") {
        funtion();
      }
    }
  };

  return (
    <Input
      type="text"
      className={className}
      label={label}
      onChange={onChange}
      onFocus={onFocus}
      value={value}
      name={name}
      placeholder={placeholder}
      onBlur={onBlur}
      containerProps={{ className: "min-w-[100px]" }}
      autoFocus={autoFocus}
      onKeyDown={handleKeyPress}
    />
  );
};

export default InputBox;
