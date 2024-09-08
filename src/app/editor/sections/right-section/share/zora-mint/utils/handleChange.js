/**
 * Handles changes to input fields, including validation and error handling.
 * Updates the state and error state accordingly.
 *
 * @param {Object} e - The event object from the input change.
 * @param {number} index - The index of the recipient or item in the list.
 * @param {Function} setState - The function to update the state.
 * @param {Function} setErrorState - The function to update the error state.
 */

export const handleChange = (e, setState, setErrorState) => {
  const { name, value } = e.target;

  // Update the state for the specific field dynamically
  setState((prevState) => ({
    ...prevState,
    [name]: value,
  }));

  // Helper function to set error state dynamically
  const setError = (errorKey, errorMessage) => {
    setErrorState((prev) => ({
      ...prev,
      [errorKey]: !!errorMessage,
      [`${errorKey}Message`]: errorMessage,
    }));
  };

  // Dynamic validation rules
  const validationRules = {
    contractName: {
      errorKey: "isContractNameError",
      errorMessage: "Collection Name is required",
      validate: (val) => !!val,
    },
    chargeForMintPrice: {
      errorKey: "isChargeForMintError",
      errorMessage: "Price is required",
      validate: (val) => !!val,
    },
    royaltyPercent: {
      errorKey: "isRoyaltyPercentError",
      errorMessage: "Royalty percent is required",
      validate: (val) => !!val,
    },
    // Add more fields and their validation rules here
  };

  // Reusable validation function
  const validateField = (fieldName, fieldValue) => {
    const rule = validationRules[fieldName];
    if (rule) {
      const { errorKey, errorMessage, validate } = rule;
      setError(errorKey, validate(fieldValue) ? "" : errorMessage);
    }
  };

  // Validate the current field
  validateField(name, value);
};
