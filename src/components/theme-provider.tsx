"use client";

import { useLayoutEffect } from "react";

export default function ThemeProvider() {
  useLayoutEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  return null;
}
