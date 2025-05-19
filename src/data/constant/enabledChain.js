import { arbitrum, base, polygon, morph } from "viem/chains";
import { ham } from "../network/ham";
import { og } from "../network/og";
import { basecampTestnet } from "../network/basecampTestnet";
import { monadTestnet } from "viem/chains";

export const LENSPOST_721_ENALBED_CHAINS = [
  base,
  polygon,
  arbitrum,
  og,
  ham,
  morph,
  basecampTestnet,
  monadTestnet,
];
