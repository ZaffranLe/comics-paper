/**
 *  Check whether the application is running on development mode.
 * @returns true whether the application is running on development environment.
 */
export function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === "development";
}

/**
 * Check whether the application is running on test mode
 * @returns true whether the application is running on test environment.
 */
export function isTestMode(): boolean {
  return process.env.NODE_ENV === "test";
}
