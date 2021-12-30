import validator from "validator";
/**
 * Check whether the given value is a valid nickname.
 * Nickname must be a string with maximum length
 *  of 20. And accepted chars _ and .
 * @param str a string to check
 * @returns true whether a string is a valid, false otherwise
 */
export function isValidNickname(str: string): boolean {
  // Check whether the username is not empty
  if (validator.isEmpty(str)) {
    return false;
  }

  // Check whether length > 0 and < 20
  if (str.length < 1 || str.length > 20) {
    return false;
  }

  // Check whether the name must be alphanumeric
  //  and also ignore the "_" and dot "."
  if (!validator.isAlphanumeric(str, "en-US", { ignore: "_." })) {
    return false;
  }

  return true;
}
