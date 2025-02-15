export const TOKEN_MAPPING_NAME = "auth_access_token";
/**
 * Check if the token is exists on localStorage or not.
 *
 * @returns true if the token is exists, false otherwise
 */
export function hasToken() {
  localStorage.getItem;
  return localStorage.getItem(TOKEN_MAPPING_NAME) !== null;
}

/**
 * Set the token into localStorage.
 *
 * @param value a value to set into token
 */
export function setToken(value: string) {
  if (value === undefined) {
    throw new Error(`Token param cannot be undefined`);
  }

  if (typeof value !== "string") {
    throw new Error(`Cannot set non-string token`);
  }
  localStorage.setItem(TOKEN_MAPPING_NAME, value);
}

/**
 * Retrieves token from localStorage. If the token is not set or stored,
 *  throw an error.
 *
 * @returns the token on localStorage.
 */
export function getToken(): string {
  const _getterToken = localStorage.getItem(TOKEN_MAPPING_NAME);
  if (_getterToken === undefined || _getterToken === null) {
    throw new Error(`Token not found on localStorage`);
  }
  return _getterToken;
}

/**
 * Delete the token if is exists on localStorage.
 */
export function deleteToken() {
  if (hasToken()) {
    localStorage.removeItem(TOKEN_MAPPING_NAME);
  }
}
