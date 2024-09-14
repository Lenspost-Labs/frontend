export const jsConfettiFn = () => {
  const jsConfetti = new JSConfetti();
  jsConfetti.addConfetti({
    emojis: ["🌈", "⚡️", "💥", "✨", "💫", "🌸"],
    confettiNumber: 100,
  });

  return jsConfetti;
};
