import DatabaseBuilder, { createTable } from "./utils/DatabaseBuilder";
import { Logger } from "./utils/Logger";

export const Tables = {
  // User
  User: "users",
  // Permission groups
  PermissionGroup: "permission_groups",
  // Permissions
  Permission: "permissions",
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
    table.integer(`permission_group`).notNullable();
  });
  // ...
  await createTable(Tables.User, (table) => {
    Logger.info(`Creating table ${Tables.User}`);
    table.increments("id").primary();
    table.string(`username`).unique().notNullable();
    table.string(`password`).unique().notNullable();
    table.string(`email`).unique().notNullable();
    table.string(`nickname`).notNullable();
    table.boolean(`confirmed`).defaultTo(false);
  });
}
