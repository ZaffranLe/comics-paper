import { User } from "./../classes/User";
import { UserController } from "./../controllers/UserController";
import { Locale } from "./../Locale";
import { MiddlewareError } from "./../errors/MiddlewareError";
import * as express from "express";
import isEmail from "validator/lib/isEmail";
import { createUrlPathFromHost } from "../utils/PathUtils";
import { isValidNickname } from "../utils/ValidatorUtils";
const router = express.Router();
import * as bcryptjs from "bcryptjs";
import { generateToken } from "../utils/TokenUtils";
import { getAuth } from "../middlewares/AuthMiddleware";

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

      // Whether has that user
      if (await UserController.hasUserByUsername(username)) {
        return next(
          new MiddlewareError(Locale.HttpResponseMessage.UserAlreadyExists, 400)
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

router.post(
  "/signin",
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.MissingRequiredFields,
          400
        )
      );
    }
    // Get user first
    const user = await UserController.getUserFromUsername(username);
    // Not found user
    if (!user) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.UserNotFound, 400)
      );
    }

    // Found, check password
    // Unless the password is correct
    if (!bcryptjs.compareSync(password, user.password)) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.IncorrectPassword, 400)
      );
    }

    // Success, create web token
    const token = await generateToken({ id: user.id, generatedAt: new Date() });
    res.json({ token: token.token });
  }
);

/**
 * Retrieves all general information of user.
 */
router.post(
  "/profile",
  getAuth,
  async (req: express.Request, res: express.Response, next: express.Next) => {
    // Token not found
    if (!req.TokenRequest) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.NoTokenProvided, 400)
      );
    }

    // Not found a user, response unauthorized
    if (!req.UserRequest) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
      );
    }

    // Extract password from user request
    const userRequest: User = req.UserRequest;
    const { username, email, nickname, id } = userRequest;
    // Response
    res.json({
      id,
      username,
      email,
      nickname,
      role: await userRequest.getRole(),
      permissions: await userRequest.getPermissions(),
    });
  }
);

const UserRouter = router;
export default UserRouter;
