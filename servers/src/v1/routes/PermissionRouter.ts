import * as express from "express";
import { PermissionController } from "../controllers/PermissionController";
import { PermissionGroupController } from "../controllers/PermissionGroupController";
const router = express.Router();

/**
 * Retrieves all permissions from the database.
 */
router.get(
  "/",
  // TODO: Require auth, as admin path to access this route
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Send all permissions here
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

export const PermissionRouter = router;
