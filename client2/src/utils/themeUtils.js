function loadThemeFromLocalStorage() {
  // If the local storage is unsupported
  if (!localStorage) {
    throw new Error("localStorage is unsupported");
  }

  let appTheme = localStorage.getItem("app-theme");
  if (appTheme === null) {
    localStorage.setItem("app-theme", "system");
  }
  appThemeNotNull =
    localStorage.getItem("app-theme") === null
      ? "system"
      : localStorage.getItem("app-theme");

  return appThemeNotNull;
}

export { loadThemeFromLocalStorage };
