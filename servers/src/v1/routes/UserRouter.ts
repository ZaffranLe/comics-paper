import { UserController } from "./../controllers/UserController";
import { Locale } from "./../Locale";
import { MiddlewareError } from "./../errors/MiddlewareError";
import * as express from "express";
import isEmail from "validator/lib/isEmail";
import { createUrlPathFromHost } from "../utils/PathUtils";
import { isValidNickname } from "../utils/ValidatorUtils";
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

/**
 * Create a new user.
 */
router.post(
  `/signup`,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const { username, password, email, nickname } = req.body;

      // Validate fields
      if (!username || !password || !email || !nickname) {
        return next(
          new MiddlewareError(
            Locale.HttpResponseMessage.MissingRequiredFields,
            400
          )
        );
      }

      // Validate nickname
      if (!isValidNickname(nickname)) {
        return next(
          new MiddlewareError(Locale.HttpResponseMessage.InvalidNickname, 400)
        );
      }

      // Validate email
      if (!isEmail(email)) {
        return next(
          new MiddlewareError(Locale.HttpResponseMessage.InvalidEmail, 400)
        );
      }

      // Insert user into database
      const responseUser = await UserController.createUser(
        username,
        password,
        email,
        nickname
      );

      // Filter password out
      const filteredResponseUser = {
        id: responseUser.id,
        username: responseUser.username,
        email: responseUser.email,
        nickname: responseUser.nickname,
      };

      // Response
      res.json(filteredResponseUser);
    } catch (error) {
      console.error(error);
      next(new MiddlewareError("UnexpectedError", 500));
    }
  }
);

const UserRouter = router;
export default UserRouter;
