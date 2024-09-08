/**
 * Restricts input for a recipient address based on the index and recipient status.
 * If the index is 0 and the recipient is in the parent list, input is restricted.
 * Otherwise, it allows the input change and updates the corresponding state.
 *
 * @param {number} index - The index of the recipient in the list.
 * @param {string} value - The new value of the recipient's address.
 * @param {string} fieldKey - The key of the field being updated (e.g., "address").
 * @param {Object} state - The current state object containing recipient data.
 * @param {Function} setState - The function to update the state.
 * @param {Object} errorState - The current error state object.
 * @param {Function} setErrorState - The function to update the error state.
 * @param {Object} parentRecipientListRef - A reference to the parent recipient list.
 */

import { handleRecipientChange } from "./handleRecipientChange";

export const restrictRecipientInput = (
  index,
  value,
  reciepint,
  fieldKey,
  state,
  setState,
  errorState,
  setErrorState,
  parentRecipientListRef
) => {
  const isRecipient = parentRecipientListRef.current.includes(reciepint);

  // Restrict input if index is 0 and recipient is in the parent list
  if (index === 0 && isRecipient) {
    return; // Do not allow input change
  }

  // Allow input for index > 0 or if the recipient is not in the parent list
  handleRecipientChange(
    index,
    fieldKey,
    value,
    state,
    setState,
    errorState,
    setErrorState
  );
};
