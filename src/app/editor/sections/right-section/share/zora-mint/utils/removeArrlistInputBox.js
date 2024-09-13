/**
 * Function to remove an input box for multiple addresses.
 * @param {number} index - The index of the item to remove.
 * @param {string} key - The key of the state to update.
 * @param {string} isErrKey - The error key to reset.
 * @param {string} errKeyMsg - The error message key to reset.
 * @param {Function} setState - The state setter function.
 */
export const removeArrlistInputBox = (
  index,
  key,
  isErrKey,
  errKeyMsg,
  state,
  setState
) => {
  const updatedState = {
    ...state,
    [key]: state[key].filter((_, i) => i !== index),
  };
  setState(updatedState);

  if (isErrKey) {
    setZoraErc1155StatesError({
      ...zoraErc1155StatesError,
      [isErrKey]: false,
      [errKeyMsg]: "",
    });
  }
};
