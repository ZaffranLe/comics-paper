import { createTable } from "./utils/DatabaseBuilder";
import { Logger } from "./utils/Logger";

/**
 * Table constants to map table naming.
 */
export const Tables = {
  // User
  User: "users",
  // Permission groups
  PermissionGroup: "permission_groups",
  // Permissions
  Permission: "permissions",
  // Permission in groups
  PermissionRelationship: "permission_relationships",
};

export async function setupDatabase() {
  console.log("Setting up database");
  // Permission group
  await createTable(Tables.PermissionGroup, (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("description").notNullable();
  });

  // Permissions
  await createTable(Tables.Permission, (table) => {
    table.increments(`id`).primary();
    table.string(`name`).notNullable();
    table.string(`description`).notNullable();
    // table.integer(`permissionGroup`).notNullable();
  });

  await createTable(Tables.PermissionRelationship, (table) => {
    table.integer(`permissionGroup`).notNullable();
    table.integer(`permissionId`).notNullable();
  });

  // Users
  await createTable(Tables.User, (table) => {
    Logger.info(`Creating table ${Tables.User}`);
    table.increments("id").primary();
    table.string(`username`).unique().notNullable();
    table.string(`password`).unique().notNullable();
    table.string(`email`).unique().notNullable();
    table.string(`nickname`).notNullable();
    // table.boolean(`confirmed`).defaultTo(false);
  });
}
