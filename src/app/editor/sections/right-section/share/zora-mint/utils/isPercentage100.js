/**
 * Determines if the total percentage allocation for all recipients equals 100.
 *
 * This function calculates the total percentage by summing up the `percentAllocation` of each recipient in the `royaltySplitRecipients` array.
 * It logs the total percentage, updates the `totalPercent` state with the calculated total, and returns a boolean indicating whether the total equals 100.
 *
 * @returns {boolean} True if the total percentage equals 100, false otherwise.
 * @param {Object} state - The state object containing royaltySplitRecipients.
 * @param {Function} setTotalPercent - The function to update the totalPercent state.
 */
export const isPercentage100 = (state, setTotalPercent) => {
  const totalPercentage = state.royaltySplitRecipients.reduce(
    (acc, item) => acc + item.percentAllocation,
    0
  );
  console.log({ totalPercentage });
  setTotalPercent(totalPercentage);
  return totalPercentage === 100;
};
