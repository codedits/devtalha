"use client";

import dynamic from "next/dynamic";

const Preloader = dynamic(() => import("./Preloader"), { ssr: false });
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
