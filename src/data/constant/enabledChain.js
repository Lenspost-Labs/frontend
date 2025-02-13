import { arbitrum, base, polygon, morph } from "viem/chains";
import { ham } from "../network/ham";
import { og } from "../network/og";
import { campNetworkTestnetV2 } from "../network/campNetworkTestnetV2";

export const LENSPOST_721_ENALBED_CHAINS = [
  base,
  polygon,
  arbitrum,
  og,
  ham,
  morph,
  campNetworkTestnetV2,
];
