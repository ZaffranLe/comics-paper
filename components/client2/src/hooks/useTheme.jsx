import { useEffect, useState } from "react";

function assertLocalStorage() {
  if (!localStorage) {
    throw new Error("Your browser does not support localStorage");
  }
}

function updateDOM() {
  assertLocalStorage();

  if (
    localStorage.theme === "dark" ||
    (!("theme" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export default function useTheme() {
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    updateDOM();
  }, [theme]);

  return {
    dark: () => {
      // Check the existing of local storage
      assertLocalStorage();

      // Then set the value
      localStorage.setItem("theme", "dark");
      setTheme("dark");
    },

    light: () => {
      // Check the existing of local storage
      assertLocalStorage();

      // Then set the value
      localStorage.setItem("theme", "light");
      setTheme("light");
    },

    system: () => {
      assertLocalStorage();
      localStorage.removeItem("theme");

      setTheme("system");
    },

    update: updateDOM,

    theme,
  };
}
