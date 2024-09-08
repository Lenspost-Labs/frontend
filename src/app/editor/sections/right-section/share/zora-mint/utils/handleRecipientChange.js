/**
 * Handles changes to the recipient information, including validation and error handling.
 * Updates the state and error state accordingly.
 *
 * @param {number} index - The index of the recipient in the list.
 * @param {string} key - The key of the field being updated (e.g., "percentAllocation" or "address").
 * @param {any} value - The new value of the field.
 * @param {Object} state - The current state object containing recipient data.
 * @param {Function} setState - The function to update the state.
 * @param {Object} errorState - The current error state object.
 * @param {Function} setErrorState - The function to update the error state.
 */

export const handleRecipientChange = (
  index,
  key,
  value,
  state,
  setState,
  errorState,
  setErrorState
) => {
  const updatedRecipients = [...state.royaltySplitRecipients];

  // Helper function to set error state
  const setError = (errorKey, errorMessage) => {
    setErrorState((prev) => ({
      ...prev,
      [errorKey]: !!errorMessage,
      [`${errorKey}Message`]: errorMessage,
    }));
  };

  // Validate input based on key using dynamic validation rules
  const validationRules = {
    percentAllocation: {
      errorKey: "isRoyaltySplitError",
      errorMessage: "Split should be between 1% to 100%",
      validate: (val, index) => {
        if (index === 0) {
          return val >= 10 && val <= 100 && !isNaN(val);
        } else {
          return val >= 1 && val <= 100 && !isNaN(val);
        }
      },
    },
    address: {
      errorKey: "isRoyaltySplitError",
      errorMessage: "Recipient address is required",
      validate: (val) => !!val,
    },
  };

  // Reusable validation function
  const validateField = (fieldName, fieldValue, index) => {
    const rule = validationRules[fieldName];
    if (rule) {
      const { errorKey, errorMessage, validate } = rule;
      setError(errorKey, validate(fieldValue, index) ? "" : errorMessage);
    }
  };

  // Validate the current field
  validateField(key, value, index);

  // Update the recipient's value
  updatedRecipients[index][key] = value;
  setState((prevEnabled) => ({
    ...prevEnabled,
    royaltySplitRecipients: updatedRecipients,
  }));
};
