import validator from "validator";
/**
 * Check whether the given value is a valid nickname.
 * Nickname must be a string with maximum length
 *  of 30. And accepted chars _ and .
 * @param str a string to check
 * @returns true whether a string is a valid, false otherwise
 */
export function isValidNickname(str: string): boolean {
  // Check whether length > 0 and < 30
  if (str.length < 1 || str.length > 30) {
    return false;
  }

  // Check whether the name must be alphanumeric
  //  and also ignore the "_" and dot "."
  if (!validator.isAlphanumeric(str, "en-US", { ignore: "_." })) {
    return false;
  }

  return true;
}

/**
 * Check whether the given value is a valid introduction.
 * Valid introduction contains maximum 200 characters.
 *
 * @param str a string to check
 * @returns true whether a string is a valid, false otherwise
 */
export function isValidIntroduction(str: string): boolean {
  // Check whether the introduction is not empty
  if (validator.isEmpty(str)) {
    return false;
  }

  // Check whether length > 0 and < 200
  if (str.length < 1 || str.length > 200) {
    return false;
  }

  return true;
}
