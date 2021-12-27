import { Permission } from "../interfaces/PermissionInterface";
import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";

/**
 * Check whether the permission existed.
 * @param id  a number of permission
 * @returns true whether the permission is existed, false otherwise
 */
async function hasPermission(id: number) {
  // Not found id
  if (id === undefined) {
    throw new Error("id field not found");
  }

  const o = await DatabaseBuilder(Tables.PermissionGroup)
    .select()
    .from<Permission>(Tables.Permission)
    .where({ id })
    .first();
  return o !== undefined;
}

/**
 * Insert new permission.
 *
 * @param id a unique number of permission
 * @param name a name of the permission
 * @param description a description of the permission
 */
async function createPermission(id: number, name: string, description: string) {
  // Not found id
  if (id === undefined) {
    throw new Error("id field not found");
  }

  // Not found name
  if (name === undefined) {
    throw new Error("name field not found");
  }

  // Not found description
  if (description === undefined) {
    throw new Error("description field not found");
  }

  // Check whether the permission existed
  if (await hasPermission(id)) {
    throw new Error("Permission existed");
  }

  await DatabaseBuilder(Tables.Permission).insert({
    id,
    name,
    description,
  });
}

/**
 * Retrieves all permissions
 * @return all existed permissions in database
 */
async function getAllPermissions() {
  return await DatabaseBuilder(Tables.Permission).select();
}

export const PermissionController = {
  hasPermission,
  createPermission,
  getAllPermissions,
};
