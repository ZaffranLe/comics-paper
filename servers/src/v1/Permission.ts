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

  // Users permissions
  generatePermission(
    PermissionEnum.USER_ROLE_CHANGE,
    Locale.Permission.UserRoleChange.Name,
    Locale.Permission.UserRoleChange.Description
  );

  generatePermission(
    PermissionEnum.USER_UPDATE_PROFILE,
    Locale.Permission.UserUpdateProfile.Name,
    Locale.Permission.UserUpdateProfile.Description
  );

  // Resources
  generatePermission(
    PermissionEnum.RESOURCE_CREATE,
    Locale.Permission.ResourceCreate.Name,
    Locale.Permission.ResourceCreate.Description
  );

  generatePermission(
    PermissionEnum.RESOURCE_ACCESS_ALL,
    Locale.Permission.ResourceAccessAll.Name,
    Locale.Permission.ResourceAccessAll.Description
  );

  generatePermission(
    PermissionEnum.RESOURCE_UPDATE,
    Locale.Permission.ResourceUpdate.Name,
    Locale.Permission.ResourceUpdate.Description
  );

  generatePermission(
    PermissionEnum.RESOURCE_DELETE,
    Locale.Permission.ResourceDelete.Name,
    Locale.Permission.ResourceDelete.Description
  );

  generatePermission(
    PermissionEnum.COMIC_CREATE,
    Locale.Permission.ComicCreate.Name,
    Locale.Permission.ComicCreate.Description
  );

  generatePermission(
    PermissionEnum.COMIC_UPDATE,
    Locale.Permission.ComicUpdate.Name,
    Locale.Permission.ComicUpdate.Description
  );

  generatePermission(
    PermissionEnum.COMIC_DELETE,
    Locale.Permission.ComicDelete.Name,
    Locale.Permission.ComicDelete.Description
  );

  generatePermission(
    PermissionEnum.COMIC_CHAPTER_CREATE,
    Locale.Permission.ComicChapterCreate.Name,
    Locale.Permission.ComicChapterCreate.Description
  );

  generatePermission(
    PermissionEnum.GRANT_PERMISSION_TO_GROUP,
    Locale.Permission.GrantPermissionToGroup.Name,
    Locale.Permission.GrantPermissionToGroup.Description
  );
  generatePermission(
    PermissionEnum.REVOKE_PERMISSION_FROM_GROUP,
    Locale.Permission.RevokePermissionFromGroup.Name,
    Locale.Permission.RevokePermissionFromGroup.Description
  );

  generatePermission(
    PermissionEnum.COMIC_TAG_CREATE,
    Locale.Permission.ComicTagCreate.Name,
    Locale.Permission.ComicTagCreate.Description
  );

  generatePermission(
    PermissionEnum.COMIC_BOOK_TAG_REF_CREATE,
    Locale.Permission.ComicBookTagRefCreate.Name,
    Locale.Permission.ComicBookTagRefCreate.Description
  );

  // console.log("All permissions: ");
  console.table(await PermissionController.getPermissions());
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
  // Admin can modify resource
  generateRelation(PermissionGroupEnum.ADMIN, PermissionEnum.RESOURCE_CREATE);

  // Admin can access all Resources
  generateRelation(
    PermissionGroupEnum.ADMIN,
    PermissionEnum.RESOURCE_ACCESS_ALL
  );
  // Admin can modify(update ) resource
  generateRelation(PermissionGroupEnum.ADMIN, PermissionEnum.RESOURCE_UPDATE);

  // And also can remove resource
  generateRelation(PermissionGroupEnum.ADMIN, PermissionEnum.RESOURCE_DELETE);

  // Modify permission
  //    able to generate new permission, permission group and grant
  generateRelation(
    PermissionGroupEnum.ADMIN,
    PermissionEnum.ADMIN_DELETE_PERMISSION_GROUP
  );

  generateRelation(
    PermissionGroupEnum.ADMIN,
    PermissionEnum.ADMIN_UPDATE_PERMISSION_GROUP
  );
  generateRelation(
    PermissionGroupEnum.ADMIN,
    PermissionEnum.GRANT_PERMISSION_TO_GROUP
  );

  generateRelation(
    PermissionGroupEnum.ADMIN,
    PermissionEnum.REVOKE_PERMISSION_FROM_GROUP
  );

  // able to create new comic
  generateRelation(PermissionGroupEnum.ADMIN, PermissionEnum.COMIC_CREATE);
  // able to update new comic
  generateRelation(PermissionGroupEnum.ADMIN, PermissionEnum.COMIC_UPDATE);
  // Able to delete comic
  generateRelation(PermissionGroupEnum.ADMIN, PermissionEnum.COMIC_DELETE);

  // Comic chapter permissions
  generateRelation(
    PermissionGroupEnum.ADMIN,
    PermissionEnum.COMIC_CHAPTER_CREATE
  );

  // Tags
  generateRelation(PermissionGroupEnum.ADMIN, PermissionEnum.COMIC_TAG_CREATE);
  generateRelation(
    PermissionGroupEnum.ADMIN,
    PermissionEnum.COMIC_BOOK_TAG_REF_CREATE
  );
  // Mod permissions
  // Able to create a new comic
  generateRelation(PermissionGroupEnum.MOD, PermissionEnum.COMIC_CREATE);
  // Able to update comic
  generateRelation(PermissionGroupEnum.MOD, PermissionEnum.COMIC_UPDATE);
  // Able to delete comic
  generateRelation(PermissionGroupEnum.MOD, PermissionEnum.COMIC_DELETE);
  // Comic chapters
  generateRelation(
    PermissionGroupEnum.MOD,
    PermissionEnum.COMIC_CHAPTER_CREATE
  );

  // tags
  generateRelation(PermissionGroupEnum.MOD, PermissionEnum.COMIC_TAG_CREATE);
  generateRelation(
    PermissionGroupEnum.MOD,
    PermissionEnum.COMIC_BOOK_TAG_REF_CREATE
  );
  // User permissions
  generateRelation(
    PermissionGroupEnum.USER,
    PermissionEnum.USER_UPDATE_PROFILE
  );

  // console.log(
  //   "Relationships",
  //   await PermissionRelationshipController.getGrantedPermissionsFromGroup(
  //     PermissionGroupEnum.ADMIN
  //   )
  // );
}

export {
  setupPermissionGroup,
  setupPermission,
  setupDefaultPermissionRelationship,
};
