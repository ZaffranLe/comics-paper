import { Logger } from "./utils/Logger";
import { PermissionGroupController } from "./controllers/PermissionGroupController";
import { PermissionGroupEnum } from "./interfaces/PermissionGroup";

/**
 * Permission group model
 */
async function setupPermissionGroup() {
  Logger.info(`Setting up permission group...`);
  if (
    !PermissionGroupController.hasPermissionGroup(PermissionGroupEnum.Admin)
  ) {
    PermissionGroupController.createPermissionGroup(
      PermissionGroupEnum.Admin,
      "Administrator permissions"
    );
  }
}

export const PermissionInstance = {
  setupPermissionGroup,
};
