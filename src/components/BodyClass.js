"use client";

import { useLayoutEffect } from "react";

// Keeps <body class> and the header theme in sync on client-side navigation.
export default function BodyClass({ className, header = "light" }) {
  useLayoutEffect(() => {
    document.body.className = className;
    document.documentElement.dataset.header = header;
  }, [className, header]);
  return null;
}
