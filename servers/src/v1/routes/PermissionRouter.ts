import { Locale } from "./../Locale";
import { MiddlewareError } from "./../errors/MiddlewareError";
import express from "express";
import { PermissionController } from "../controllers/PermissionController";
import { PermissionGroupController } from "../controllers/PermissionGroupController";
const router = express.Router();

/**
 * Retrieves all permissions from the database.
 */
router.get(
  "/",
  async (
    _req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      // Send all permissions here
      res.json(await PermissionController.getPermissions());
    } catch (err) {
      next(new MiddlewareError(err.message, 500));
    }
  }
);

router.get(
  `/roles`,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    /**
     * Get all roles (permission group from database)
     */

    res.json(await PermissionGroupController.getAllPermissionGroups());
  }
);

router.get(`/roles/:roleId`, async (req, res, next) => {
  /**
   * Get a specific role (permission group from database)
   */

  const roleId = req.params.roleId as any;
  if (!roleId) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
    );
  }

  const permissions = await PermissionGroupController.getPermissionsByGroup(
    roleId
  );

  res.json(
    permissions.map((permission) => {
      return {
        id: permission.PermissionId,
        name: permission.PermissionName,
        description: permission.PermissionDescription,
      };
    })
  );
});

export const PermissionRouter = router;
