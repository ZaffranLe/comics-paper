import { User } from "./../classes/User";
import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";

/**
 *  Create a native relation between user and permission group.
 *
 * @param userId a user identifier to get into the permission group
 * @param permissionGroup the permission group id
 * @returns
 */
async function createUserPermission(userId: number, permissionGroup: number) {
  return DatabaseBuilder.insert({ userId, permissionGroup }).into(
    Tables.UserPermission
  );
}

async function createUser(user: User) {
  return DatabaseBuilder.insert(user).into(Tables.User);
}

export const UserController = {};
