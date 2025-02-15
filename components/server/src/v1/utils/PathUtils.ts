import * as path from 'path';
/**
 * Retrieves the full path contains host and suffix which in parameter.
 *
 * @param pathSuffix The path suffix to append to the base path.
 * @returns a full url path.
 */
export function createUrlPathFromHost(pathSuffix: string): string {
  return path.join(process.env.PATH_PREFIX, pathSuffix);
}
