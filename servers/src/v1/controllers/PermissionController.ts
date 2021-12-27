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
    .select({ id })
    .first();
  return o !== undefined;
}

async function createPermission(
  id: number,
  permissionGroupId: number,
  name: string,
  description: string
) {
  
}

export const PermissionController = {
  hasPermission,
};
