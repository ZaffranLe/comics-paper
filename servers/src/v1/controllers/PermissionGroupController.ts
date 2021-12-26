import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";

/**
 * Retrieves all permission groups from the database.
 * @returns  all permission groups
 */
async function getAllPermissionGroups() {
  return DatabaseBuilder(Tables.PermissionGroup).select();
}
/**
 * Check whether the permission group is existed or not.
 * @param name a name of permission group
 * @returns a permission group object
 */
async function hasPermissionGroup(name: string) {
  // Not found a name
  if (name === undefined) {
    throw new Error("name not found");
  }

  // Check permission group with name
  const permissionGroup = await DatabaseBuilder(Tables.PermissionGroup)
    .where({ name })
    .first();

  // Not found permission group
  if (permissionGroup === undefined) {
    return false;
  }

  return true;
}

/**
 * Insert new permission group.
 *
 * @param name a name of permission group
 * @param description a description of the permission group
 */
async function createPermissionGroup(name: string, description: string) {
  // Not found a name
  if (name === undefined || description === undefined) {
    throw new Error("name or description not found");
  }

  // Create a permission group with name
  DatabaseBuilder(Tables.PermissionGroup).insert({ name, description });
}

export const PermissionGroupController = {
  createPermissionGroup,
  hasPermissionGroup,
  getAllPermissionGroups,
};
