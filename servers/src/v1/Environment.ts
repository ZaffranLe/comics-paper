/**
 *  Check whether the application is running on development mode.
 * @returns true whether the application is running on development environment.
 */
export function isDevelopmentMode(): boolean {
  return process.env.NODE_ENV === "development";
}
