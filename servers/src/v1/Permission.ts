import { PermissionRelationshipController } from "./controllers/PermissionRelationshipController";
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

/**
 * Generate a permission whether not existed.
 */
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

async function generateRelation(permissionGroup: number, permissionId: number) {
  if (
    !(await PermissionRelationshipController.hasRelation(
      permissionId,
      permissionGroup
    ))
  ) {
    Logger.info(`Generating relation ${permissionId} (${permissionGroup})...`);
    await PermissionRelationshipController.addRelation(
      permissionId,
      permissionGroup
    );
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
  // console.log(
  //   "Current Permission Group",

  // );
  console.table(await PermissionGroupController.getAllPermissionGroups());

  Logger.info(`Permission group setup completed.`);
}

/**
 * Initialize a permission for all groups
 */
async function setupPermission() {
  Logger.info(`Setting up permission...`);

  // Create user permission
  generatePermission(
    PermissionEnum.ADMIN_CREATE_USER,
    Locale.Permission.AdminCreateUser.Name,
    Locale.Permission.AdminCreateUser.Description
  );

  // Delete user permission
  generatePermission(
    PermissionEnum.ADMIN_DELETE_USER,
    Locale.Permission.AdminDeleteUser.Name,
    Locale.Permission.AdminDeleteUser.Description
  );

  // Update user permission
  generatePermission(
    PermissionEnum.ADMIN_UPDATE_USER,
    Locale.Permission.AdminUpdateUser.Name,
    Locale.Permission.AdminUpdateUser.Description
  );

  // Create permission group permission
  generatePermission(
    PermissionEnum.ADMIN_CREATE_PERMISSION_GROUP,
    Locale.Permission.AdminCreatePermissionGroup.Name,
    Locale.Permission.AdminCreatePermissionGroup.Description
  );

  // Delete permission group permission
  generatePermission(
    PermissionEnum.ADMIN_DELETE_PERMISSION_GROUP,
    Locale.Permission.AdminDeletePermissionGroup.Name,
    Locale.Permission.AdminDeletePermissionGroup.Description
  );

  // Update permission group permission
  generatePermission(
    PermissionEnum.ADMIN_UPDATE_PERMISSION_GROUP,
    Locale.Permission.AdminUpdatePermissionGroup.Name,
    Locale.Permission.AdminUpdatePermissionGroup.Description
  );

  // console.log("All permissions: ");
  console.table(await PermissionController.getAllPermissions());
}

async function setupDefaultPermissionRelationship() {
  // Admin permissions
  generateRelation(PermissionGroupEnum.ADMIN, PermissionEnum.ADMIN_CREATE_USER);
  generateRelation(PermissionGroupEnum.ADMIN, PermissionEnum.ADMIN_DELETE_USER);
  generateRelation(PermissionGroupEnum.ADMIN, PermissionEnum.ADMIN_UPDATE_USER);
  generateRelation(
    PermissionGroupEnum.ADMIN,
    PermissionEnum.ADMIN_CREATE_PERMISSION_GROUP
  );
  generateRelation(
    PermissionGroupEnum.ADMIN,
    PermissionEnum.ADMIN_DELETE_PERMISSION_GROUP
  );
  generateRelation(
    PermissionGroupEnum.ADMIN,
    PermissionEnum.ADMIN_UPDATE_PERMISSION_GROUP
  );

  console.log(
    "Relationships",
    await PermissionRelationshipController.getGrantedPermissionsFromGroup(
      PermissionGroupEnum.ADMIN
    )
  );

  // Mod permissions
  // User permissions
}

export {
  setupPermissionGroup,
  setupPermission,
  setupDefaultPermissionRelationship,
};
