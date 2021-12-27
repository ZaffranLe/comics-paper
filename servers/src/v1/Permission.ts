import { Locale } from "./Locale";
import { Logger } from "./utils/Logger";
import { PermissionGroupController } from "./controllers/PermissionGroupController";
import { PermissionGroupEnum } from "./interfaces/PermissionGroup";

async function generatePermissionGroup(
  id: number,
  name: string,
  description: string
) {
  if (!(await PermissionGroupController.hasPermissionGroup(id))) {
    Logger.info(
      (
        await PermissionGroupController.createPermissionGroup(
          id,
          name,
          description
        )
      ).toString()
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

  // // Admin
  // await PermissionGroupController.addPermissionToGroup(
  //   PermissionGroupEnum.ADMIN,
  //   "admin.create"
  // );
  // await PermissionGroupController.addPermissionToGroup(
  //   PermissionGroupEnum.ADMIN,
  //   "admin.delete"
  // );
  // await PermissionGroupController.addPermissionToGroup(
  //   PermissionGroupEnum.ADMIN,
  //   "admin.edit"
  // );
  // await PermissionGroupController.addPermissionToGroup(
  //   PermissionGroupEnum.ADMIN,
  //   "admin.list"
  // );

  // // User
  // await PermissionGroupController.addPermissionToGroup(
  //   PermissionGroupEnum.USER,
  //   "user.create"
  // );
  // await PermissionGroupController.addPermissionToGroup(
  //   PermissionGroupEnum.USER,
  //   "user.delete"
  // );
  // await PermissionGroupController.addPermissionToGroup(
  //   PermissionGroupEnum.USER,
  //   "user.edit"
  // );
  // await PermissionGroupController.addPermissionToGroup(
  //   PermissionGroupEnum.USER,
  //   "user.list"
  // );

  // // Print all
  // console.log(
  //   "Current Permission Group",
  //   await PermissionGroupController.getAllPermissionGroups()
  // );
  // Logger.info(`Permission setup completed.`);
}

export const PermissionInstance = {
  setupPermissionGroup,
  setupPermission,
};
