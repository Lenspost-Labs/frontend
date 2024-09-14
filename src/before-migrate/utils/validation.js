export const isEthAddress = (address) => {
  const ethereumAddressRegex = /^0x[a-fA-F0-9]{40}$/;
  if (ethereumAddressRegex.test(address)) {
    return true;
  } else {
    return false;
  }
};

export const isLensterUrl = (url) => {
  const lensterPostRegex = /^https:\/\/lenster\.xyz\/posts\/0x[\s\S]*$/
  const heyPostregex =  /^https:\/\/hey\.xyz\/posts\/0x[\s\S]*$/;

  if (lensterPostRegex.test(url) || heyPostregex.test(url)) {
    return true;
  } else {
    return false;
  }
};

export const isLensHandle = (title) => {
  const lensHandleRegex = /^@[\w.]+$/;

  if (lensHandleRegex.test(title)) {
    return true;
  } else {
    return false;
  }
};

// regex for solana address
export const isSolAddress = (address) => {
  const solAddressRegex = /^[\w]{44}$/;
  if (solAddressRegex.test(address)) {
    return true;
  } else {
    return false;
  }
};
