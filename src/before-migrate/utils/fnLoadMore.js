export const fnLoadMore = (hasNextPage, fetchNextPage) => {
  if (hasNextPage) {
    // Check if the target element exists in the DOM
    const targetElement = document.querySelector("#bottom");

    if (targetElement) {
      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            fetchNextPage();
          }
        },
        { threshold: 0.5 } // Set threshold to 0.5 (50%)
      );

      observer.observe(targetElement);

      return () => observer.disconnect();
    }
  }
};
