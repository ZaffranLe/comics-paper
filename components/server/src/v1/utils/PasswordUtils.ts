import * as bcryptjs from 'bcryptjs';
/**
 * Hash a provided string
 *
 * @param password a string to hash
 * @returns a hashed string
 */
function hash(password: string) {
  return bcryptjs.hashSync(
    password,
    parseInt(process.env.USER_PASSWORD_SALT_ROUNDING),
  );
}

/**
 * Compare a provided string with a hashed string.
 *
 * @param password a string to compare
 * @param hash a hashed string to compare
 * @returns true if the password matches the hash, false otherwise.
 */
function compare(password: string, hash: string): boolean {
  return bcryptjs.compareSync(password, hash);
}

const PasswordUtils = {
  hash,
  compare,
};
export default PasswordUtils;
