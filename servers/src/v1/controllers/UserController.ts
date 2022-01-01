import { PermissionGroupEnum } from "./../interfaces/PermissionGroupInterface";
import { User } from "./../classes/User";
import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";
import { UserResponseInterface } from "../interfaces/UserInterface";
import { v4 as uuid } from "uuid";
import * as bcryptjs from "bcryptjs";
import validator from "validator";

/**
 *  Create a native relation between user and permission group.
 *
 * @param userId a user identifier to get into the permission group
 * @param permissionGroup the permission group id
 * @returns
 */
async function createUserPermission(userId: string, permissionGroup: number) {
  return DatabaseBuilder.insert({ userId, permissionGroup }).into(
    Tables.UserPermission
  );
}

/**
 * Create new user.
 *
 * @param username a username of the user
 * @param password a password of the user
 * @param email an email of the user
 * @param nickname a nickname of the user
 * @returns a response user bare unique id
 */
async function createUser(
  username: string,
  password: string,
  email: string,
  nickname: string
) {
  // generate uuid
  const id = uuid();
  // hash password

  const hashedPassword = bcryptjs.hashSync(
    password,
    bcryptjs.genSaltSync(parseInt(process.env.USER_PASSWORD_SALT_ROUNDING))
  );

  // create user
  const response: UserResponseInterface = {
    id,
    username,
    password: hashedPassword,
    email,
    nickname,
  };
  await DatabaseBuilder.insert(response).into(Tables.User);
  await createUserPermission(id, PermissionGroupEnum.USER);

  return response;
}

/**
 * Retrieves user via their id. Whether not found is return null.
 *  NOTE: This function will also return a hashed password of the user.
 *      Please ensure that fetch the password before response to client
 * @param id a id of the user
 * @returns a user whether exists, null otherwise.
 */
async function getUserFromUUID(id: string): Promise<UserResponseInterface> {
  // parameter error
  if (!id) {
    throw new Error("Invalid user uuid parameter");
  }

  // select from database
  const user = await DatabaseBuilder(Tables.User)
    .select()
    .where({ id })
    .first();
  if (user == null) {
    return null;
  }

  return {
    id: user.id,
    username: user.username,
    password: user.password,
    email: user.email,
    nickname: user.nickname,
  };
}

/**
 * Check whether the user exists.
 *
 * @param id a unique id of the user
 * @returns true whether exists, false otherwise
 */
async function hasUserByUUID(id: string) {
  // undefined id or null string
  if (!id) {
    throw new Error("Invalid user uuid parameter");
  }
  const user = await DatabaseBuilder(Tables.User)
    .select()
    .where({ id })
    .first();
  return user != null;
}

/**
 * Check whether the user exists.
 * @param username a username of the user
 * @returns true whether exists, false otherwise
 */
async function hasUserByUsername(username: string) {
  // undefined username or null string
  if (!username) {
    throw new Error("Invalid username parameter");
  }
  const user = await DatabaseBuilder(Tables.User)
    .select()
    .where({ username })
    .first();
  return user != null;
}

/**
 * Retrieves a user from it username.
 * @param username a username of the user
 * @returns a user whether exists, null otherwise
 */
async function getUserFromUsername(username: string) {
  if (!username) {
    throw new Error("Invalid username parameter");
  }
  return await DatabaseBuilder(Tables.User)
    .select()
    .where({ username })
    .first();
}

async function getPermissionGroupFromUserId(userId: string) {
  // Must not be empty and format of uuid
  if (!userId || !validator.isUUID(userId)) {
    throw new Error("Invalid user id parameter");
  }
  /// Return
  return await DatabaseBuilder(Tables.UserPermission)
    .select()
    .where({ userId })
    .first();
}

export const UserController = {
  createUserPermission,
  createUser,
  getUserFromUUID,
  hasUserByUUID,
  hasUserByUsername,
  getUserFromUsername,
  getPermissionGroupFromUserId,
};
