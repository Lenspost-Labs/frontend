/**
 * Adds a new input box for multi addresses based on the key provided.
 *
 * If the key is "royaltySplitRecipients", it adds a new object with address and percentAllocation properties.
 * For any other key, it adds an empty string to the array.
 *
 * @param {string} key - The key to identify the array to which a new input box should be added.
 * @param {Function} setState - The function to update the state.
 */
export const addArrlistInputBox = (key, setState) => {
  // Check if the key is for royaltySplitRecipients
  if (key === "royaltySplitRecipients") {
    // Add a new object to the array for royaltySplitRecipients
    setState((prevState) => ({
      ...prevState,
      [key]: [...prevState[key], { address: "", percentAllocation: "" }],
    }));
    return;
  }

  // For any other key, add an empty string to the array
  setState((prevState) => ({
    ...prevState,
    [key]: [...prevState[key], ""],
  }));
};
