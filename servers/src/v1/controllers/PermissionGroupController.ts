import { PermissionGroup } from "../interfaces/PermissionGroupInterface";
import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";

/**
 * Retrieves all permission groups from the database.
 * @returns  all permission groups
 */
async function getAllPermissionGroups() {
  return DatabaseBuilder.select().from<PermissionGroup>(Tables.PermissionGroup);
}
/**
 * Check whether the permission group is existed or not.
 * @param id a number of permission group
 * @returns a permission group object
 */
async function hasPermissionGroup(id: number) {
  // Not found a name
  if (id === undefined) {
    throw new Error("id not found");
  }

  // Check permission group with name
  const permissionGroup = await DatabaseBuilder(Tables.PermissionGroup)
    .where({ id })
    .first();

  // Not found permission group
  if (permissionGroup === undefined) {
    return false;
  }

  return true;
}

/**
 * Insert new permission group.
 * @param id a number of permission group
 * @param name a name of permission group
 * @param description a description of the permission group
 */
async function createPermissionGroup(
  id: number,
  name: string,
  description: string
) {
  // Not found a name
  if (id === undefined || name === undefined || description === undefined) {
    throw new Error("id, name or description not found");
  }

  // Create a permission group with name
  return DatabaseBuilder(Tables.PermissionGroup)
    .insert({ id, name, description })
    .returning("*");
}

export const PermissionGroupController = {
  createPermissionGroup,
  hasPermissionGroup,
  getAllPermissionGroups,
};
