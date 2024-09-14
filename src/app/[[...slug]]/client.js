"use client";

import React from "react";
import dynamic from "next/dynamic";

const WrapperCSR = dynamic(() => import("../../before-migrate/wrapper"), {
  ssr: false,
});

export function ClientOnly() {
  return <WrapperCSR />;
}
