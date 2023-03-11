export default function useDarkMode() {
  return {
    /**
     * The operating system is on dark or bright
     */
    isOperatingSystemDark:
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches,
  };
}
