import { Tables } from "../Database";
import { PermissionGroupInterface } from "../interfaces/PermissionGroupInterface";
import { PermissionInterface } from "../interfaces/PermissionInterface";
import { PermissionRelationshipInterface } from "../interfaces/PermissionRelationshipInterface";
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
    return await DatabaseBuilder(Tables.PermissionRelationship)
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

    await DatabaseBuilder(Tables.PermissionRelationship).insert({
        permissionId,
        permissionGroup,
    });
}

/**
 * Retrieves all available permissions in permission group.
 *
 * @param permissionGroup a permission group id
 * @returns return all available permissions in a permission group.
 */
async function getGrantedPermissionsFromGroup(permissionGroup: number) {
    // select * from permission_relationship where permission_group = permission_group
    const result = await DatabaseBuilder(Tables.PermissionRelationship)
        .select(
            `${Tables.PermissionRelationship}.permissionId`,
            `${Tables.PermissionRelationship}.permissionGroup`,
            `${Tables.Permission}.name as permissionName`,
            `${Tables.Permission}.description as permissionDescription`,
            `${Tables.PermissionGroup}.name as permissionGroupName`,
            `${Tables.PermissionGroup}.description as permissionGroupDescription`
        )
        .from(Tables.PermissionRelationship)
        .where({ permissionGroup })
        .innerJoin(
            Tables.Permission,
            `${Tables.PermissionRelationship}.permissionId`,
            `${Tables.Permission}.id`
        )
        .innerJoin(
            Tables.PermissionGroup,
            `${Tables.PermissionRelationship}.permissionGroup`,
            `${Tables.PermissionGroup}.id`
        )
        .from(Tables.PermissionRelationship);

    const extractedValue: PermissionRelationshipInterface[] =
        result.map<PermissionRelationshipInterface>(
            ({
                permissionId,
                permissionGroup,
                permissionGroupName,
                permissionGroupDescription,
                permissionName,
                permissionDescription,
            }) => {
                const group: PermissionGroupInterface = {
                    id: permissionGroup,
                    name: permissionGroupName,
                    description: permissionGroupDescription,
                };
                const permission: PermissionInterface = {
                    id: permissionId,
                    name: permissionName,
                    description: permissionDescription,
                };
                return { permissionGroup: group, permission: permission };
            }
        );
    return extractedValue;
}

/**
 * Removes a permission from a permission group that linked together.
 *
 * @param permissionGroupId a permission group id
 * @param permissionId a permission id
 */
async function removeRelationship(
    permissionGroupId: number,
    permissionId: number
) {
    await DatabaseBuilder(Tables.PermissionRelationship)
        .delete()
        .where({ permissionGroup: permissionGroupId, permissionId });
}

export const PermissionRelationshipController = {
    addRelation,
    hasRelation,
    getGrantedPermissionsFromGroup,

    removeRelationship,
};
