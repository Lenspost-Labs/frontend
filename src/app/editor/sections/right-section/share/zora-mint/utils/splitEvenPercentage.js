/**
 * Splits the percentage evenly among recipients and updates the state.
 * @param {object} state - The current state containing recipient data.
 * @param {function} setState - The function to update the state.
 */
export const splitEvenPercentage = (state, setState) => {
  const result = state.royaltySplitRecipients?.map((item) => {
    return {
      address: item.address,
      percentAllocation: Math.floor(
        (100 / state.royaltySplitRecipients.length).toFixed(2)
      ),
    };
  });

  setState((prevEnabled) => ({
    ...prevEnabled,
    royaltySplitRecipients: result,
  }));
};
