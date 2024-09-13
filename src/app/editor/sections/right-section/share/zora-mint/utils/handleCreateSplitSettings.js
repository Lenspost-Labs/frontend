// split contract settings

import { APP_ETH_ADDRESS } from "../../../../../../../data";

/**
 * Creates settings for the split contract.
 *
 * @param {Object} state - The state object containing the necessary settings.
 * @returns {Object} - The settings object for the split contract.
 */
export const handleCreateSplitSettings = (state) => {
  const args = {
    recipients: state?.royaltySplitRecipients,
    distributorFeePercent: 0.0,
    controller: APP_ETH_ADDRESS,
  };
  return args;
};
