import * as express from "express";
import isEmail from "validator/lib/isEmail";
import { createUrlPathFromHost } from "../utils/PathUtils";
const router = express.Router();

router.get(
  `/`,
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.json({
      routes: [
        {
          path: createUrlPathFromHost(`/v1/users/`),
          method: `post`,
          description: `Create a new user.`,
        },
      ],
    });
  }
);

router.post(
  `/`,
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const { username, password, email, nickname } = req.body;
    if (!username || !password || !email || !nickname) {
      return res.status(400).json({
        error: ,
      });
    }
  }
);

const UserRouter = router;
export default UserRouter;
