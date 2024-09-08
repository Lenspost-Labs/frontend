/**
 * Restricts the ability to remove a recipient from the input box based on its index and status.
 * If the index is 0 or the recipient is found in the parent recipient list, the removal is restricted.
 * This ensures that critical recipients cannot be removed inadvertently.
 *
 * @param {number} index - The index of the recipient in the list.
 * @param {string} recipient - The address of the recipient being checked.
 * @param {Object} parentRecipientListRef - A reference to the parent recipient list.
 * @returns {boolean} - Returns true if the recipient cannot be removed, otherwise false.
 */
export const restrictRemoveRecipientInputBox = (
  index,
  recipient,
  parentRecipientListRef
) => {
  // Check if parentRecipientListRef is defined
  if (!parentRecipientListRef || !parentRecipientListRef.current) {
    return false; // Allow removal if the reference is not defined
  }

  const isRecipientInParentList =
    parentRecipientListRef.current.includes(recipient);
  return index === 0 || isRecipientInParentList;
};
