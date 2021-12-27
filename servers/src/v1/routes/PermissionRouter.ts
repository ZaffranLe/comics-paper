import * as express from "express";
const router = express.Router();

router.get(
  "/",
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.send("Hello World!");
  }
);
export const PermissionRouter = router;
