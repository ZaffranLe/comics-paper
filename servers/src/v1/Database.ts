import chalk = require("chalk");
import { isDevelopmentMode, isTestMode } from "./Environment";
import { PermissionGroupEnum } from "./interfaces/PermissionGroupInterface";
import DatabaseBuilder, { createTable } from "./utils/DatabaseBuilder";
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
  // Users permissions
  UserPermission: "user_permissions",
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
    table.increments("id").primary();
    table.string(`username`).unique().notNullable();
    table.string(`password`).unique().notNullable();
    table.string(`email`).unique().notNullable();
    table.string(`nickname`).notNullable();
    // table.boolean(`confirmed`).defaultTo(false);
  });

  // User permissions
  await createTable(Tables.UserPermission, (table) => {
    table.integer(`userId`).notNullable();
    table
      .integer(`permissionGroupId`)
      .notNullable()
      .defaultTo(PermissionGroupEnum.USER);
  });
}

export async function cleanUpDatabase() {
  if (!isDevelopmentMode() && !isTestMode()) {
    throw new Error("Unexpected environment (must be development or test)");
  }

  console.warn(chalk.red(`Invoking clean up database (utility for test)...`));
  for (let table in Tables) {
    if (Tables.hasOwnProperty(table)) {
      console.log(`Cleaning up table ${table}...`);
      DatabaseBuilder(table).truncate();
    }
  }
}
