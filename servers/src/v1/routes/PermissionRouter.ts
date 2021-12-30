import * as express from "express";
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
export const PermissionRouter = router;
