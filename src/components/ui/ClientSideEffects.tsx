"use client";

import dynamic from "next/dynamic";
import Preloader from "./Preloader";

const CustomCursor = dynamic(
  () => import("./CustomCursor").then((mod) => mod.CustomCursor),
  { ssr: false }
);

export default function ClientSideEffects() {
  return (
    <>
      <Preloader />
      <CustomCursor />
    </>
  );
}
