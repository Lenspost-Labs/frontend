export const lensCollect = (title) => {
  // Check if the title ends with ".lens"
  if (title.endsWith(".lens")) {
    // Use a regex pattern to match the lens handle with or without the "@"
    const match = title.match(/@?([\w.]+)\.lens$/);

    if (!match) return false;

    return {
      isLensCollect: true,
      lensHandle: "@" + match[1], // Use match[1] to capture the lens handle without "@" if it exists
    };
  } else {
    return false;
  }
};
