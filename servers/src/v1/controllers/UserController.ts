import { PermissionGroupEnum } from "./../interfaces/PermissionGroupInterface";
import { User } from "./../classes/User";
import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";
import {
  UserRequestInterface,
  UserResponseInterface,
} from "../interfaces/UserInterface";
import { v4 as uuid } from "uuid";
import * as bcryptjs from "bcryptjs";

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
 *
 * @param id a id of the user
 * @returns a user whether exists, null otherwise.
 */
async function getUserFromUUID(id: string) {
  // parameter error
  if (!id) {
    throw new Error("Invalid user uuid parameter");
  }

  // select from database
  return await DatabaseBuilder(Tables.User).select().where({ id }).first();
}

export const UserController = {
  createUserPermission,
  createUser,
  getUserFromUUID,
};
