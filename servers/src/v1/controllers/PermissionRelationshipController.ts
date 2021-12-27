import { Tables } from "../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";

/**
 * Check whether the database contains relationship between two tables.
 *
 * @param permissionId a permission identifier
 * @param permissionGroup a permission group identifier
 * @returns true whether contains relationship between permission and permission
 *  group, false otherwise
 */
async function hasRelation(
  permissionId: number,
  permissionGroup: number
): Promise<boolean> {
  if (permissionId === undefined || permissionGroup === undefined) {
    return false;
  }
  return await DatabaseBuilder(Tables.PermissionInGroup)
    .select()
    .where({
      permissionId,
      permissionGroup,
    })
    .first();
}

/**
 * Add a relationship between a permission and a permission group
 *
 * @param permissionId a permission id
 * @param permissionGroup  a permission group id
 */
async function addRelation(
  permissionId: number,
  permissionGroup: number
): Promise<void> {
  // relation already exists
  if (await hasRelation(permissionId, permissionGroup)) {
    throw new Error("Relationship already exists.");
  }

  await DatabaseBuilder(Tables.PermissionInGroup).insert({
    permissionId,
    permissionGroup,
  });
}

export const PermissionRelationshipController = {
  addRelation,
  hasRelation,
};
