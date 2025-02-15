import { Tables } from "../Database";
import { PermissionGroupInterface } from "../interfaces/PermissionGroupInterface";
import DatabaseBuilder from "../utils/DatabaseBuilder";

/**
 * Retrieves all permission groups from the database.
 * @returns  all permission groups
 */
async function getAllPermissionGroups() {
    return DatabaseBuilder.select().from<PermissionGroupInterface>(
        Tables.PermissionGroup
    );
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

async function hasPermissionGroupByName(name: string) {
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
    const responseId = await DatabaseBuilder(Tables.PermissionGroup).insert({
        id,
        name,
        description,
    });

    console.log();
    return { id: responseId[0], name, description };
}

/**
 * Update permission group properties
 * @param permissionGroupId a permission group id
 */
async function updatePermissionGroup(
    permissionGroupId: number,
    name: string,
    description: string
) {
    // Check field
    if (
        permissionGroupId === undefined ||
        name === undefined ||
        description === undefined
    ) {
        throw new Error("id, name or description not found");
    }

    return DatabaseBuilder(Tables.PermissionGroup)
        .update({
            name,
            description,
        })
        .where({ id: permissionGroupId });
}

/**
 * Retrieves all permissions by group id.
 *
 * @param id a permission group id
 * @returns all permissions by group id
 */
async function getPermissionsByGroup(id: number) {
    return DatabaseBuilder()
        .select({
            PermissionName: "p.name",
            PermissionId: "p.id",
            PermissionDescription: "p.description",
        })
        .from({ pr: Tables.PermissionRelationship })
        .innerJoin(
            { pg: Tables.PermissionGroup },
            "pg.id",
            "pr.permissionGroup"
        )
        .innerJoin({ p: Tables.Permission }, "p.id", "pr.permissionId")
        .where({ "pr.permissionGroup": id });
}

export const PermissionGroupController = {
    createPermissionGroup,
    hasPermissionGroup,
    getAllPermissionGroups,
    getPermissionsByGroup,
    updatePermissionGroup,
    hasPermissionGroupByName,
};
