export const replaceImageURL = (url) => {
  if (!url) return;

  if (url.includes("lenspost.s3.ap-south-1.amazonaws.com")) {
    const replacedURL = url.replace(
      "https://lenspost.s3.ap-south-1.amazonaws.com/",
      ""
    );

    return `https://lenspost.b-cdn.net/${replacedURL}`.split(" ").join("");
  } else if (url.includes("lenspost.s3.amazonaws.com")) {
    const replacedURL = url.replace("https://lenspost.s3.amazonaws.com/", "");
    return `https://lenspost.b-cdn.net/${replacedURL}`;
  } else if (url.includes("nft-cdn.alchemy.com")) {
    const replacedURL = url.replace("https://nft-cdn.alchemy.com/", "");
    return `https://lenspost-alchemy.b-cdn.net/${replacedURL}`;
  } else if (url.includes("https://ipfs.io/ipfs/ipfs/")) {
    const replacedURL = url.replace("https://ipfs.io/ipfs/ipfs/", "");
    return `https://lenspost-ipfs.b-cdn.net/${replacedURL}`;
  } else if (url.includes("https://ipfs.io/ipfs/")) {
    const replacedURL = url.replace("https://ipfs.io/ipfs/", "");
    return `https://lenspost-ipfs.b-cdn.net/${replacedURL}`;
  } else if (url.includes("https://ipfs.infura.io/ipfs/")) {
    const replacedURL = url.replace("https://ipfs.infura.io/ipfs/", "");
    return `https://lenspost-ipfs.b-cdn.net/${replacedURL}`;
  } else if (url.includes("pub-2ae8c1134d9a4424b3e00475c4421a7a.r2.dev")) {
    const replacedURL = url.replace(
      "https://pub-2ae8c1134d9a4424b3e00475c4421a7a.r2.dev/",
      ""
    );
    return `https://lenspost-r2.b-cdn.net/${replacedURL}`;
  } else {
    return url;
  }
};
