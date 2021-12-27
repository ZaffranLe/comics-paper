import { PermissionController } from "./controllers/PermissionController";
import { Locale } from "./Locale";
import { Logger } from "./utils/Logger";
import { PermissionGroupController } from "./controllers/PermissionGroupController";
import { PermissionGroupEnum } from "./interfaces/PermissionGroupInterface";
import { PermissionEnum } from "./interfaces/PermissionInterface";

/**
 * Generate a permission group whether not existed.
 */
async function generatePermissionGroup(
  id: number,
  name: string,
  description: string
) {
  if (!(await PermissionGroupController.hasPermissionGroup(id))) {
    Logger.info(`Generating permission group ${id} (${name})...`);
    await PermissionGroupController.createPermissionGroup(
      id,
      name,
      description
    );
  }
}

async function generatePermission(
  id: number,
  name: string,
  description: string
) {
  if (!(await PermissionController.hasPermission(id))) {
    Logger.info(`Generating permission ${id} (${name})...`);
    await PermissionController.createPermission(id, name, description);
  }
}

/**
 * Permission group model
 */
async function setupPermissionGroup() {
  Logger.info(`Setting up permission group...`);

  // Admin
  generatePermissionGroup(
    PermissionGroupEnum.ADMIN,
    Locale.PermissionGroup.Admin.Name,
    Locale.PermissionGroup.Admin.Description
  );

  // User
  generatePermissionGroup(
    PermissionGroupEnum.USER,
    Locale.PermissionGroup.User.Name,
    Locale.PermissionGroup.User.Description
  );

  // Mod
  generatePermissionGroup(
    PermissionGroupEnum.MOD,
    Locale.PermissionGroup.Mod.Name,
    Locale.PermissionGroup.Mod.Description
  );

  // Print all
  console.log(
    "Current Permission Group",
    await PermissionGroupController.getAllPermissionGroups()
  );

  Logger.info(`Permission group setup completed.`);
}

/**
 * Initialize a permission for all groups
 */
async function setupPermission() {
  Logger.info(`Setting up permission...`);

  generatePermission(
    PermissionEnum.ADMIN_CREATE_USER,
    Locale.Permission.AdminCreateUser.Name,
    Locale.Permission.AdminCreateUser.Description
  );

  console.log(
    "All permissions: ",
    await PermissionController.getAllPermissions()
  );
}

export { setupPermissionGroup, setupPermission };
