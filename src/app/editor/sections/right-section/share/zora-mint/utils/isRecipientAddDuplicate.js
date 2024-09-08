/**
 * Checks if there are any duplicate recipient addresses in the royaltySplitRecipients array.
 *
 * This function maps over the royaltySplitRecipients array to extract the addresses in lowercase.
 * It then checks if any address appears more than once in the array, indicating a duplicate.
 *
 * @returns {boolean} True if there are any duplicate addresses, false otherwise.
 */
export const isRecipientAddDuplicate = (state) => {
  const addresses = state.royaltySplitRecipients.map((recipient) =>
    recipient.address.toLowerCase()
  );
  // Using Set to remove duplicates and comparing the lengths to check for duplicates
  return addresses.length !== new Set(addresses).size;
};
