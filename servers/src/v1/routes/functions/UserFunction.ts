import express from "express";
import { Locale } from "../../Locale";
import {
  isValidIntroduction,
  isValidNickname,
  isValidPassword,
} from "../../utils/ValidatorUtils";
import { MiddlewareError } from "../../errors/MiddlewareError";
import { UserController } from "../../controllers/UserController";
import isEmail from "validator/lib/isEmail";
import PasswordUtils from "../../utils/PasswordUtils";
import { generateToken } from "../../utils/TokenUtils";
import { User } from "../../classes/User";
import { PermissionEnum } from "../../interfaces/PermissionInterface";

/**
 *
 * @param req
 * @param res
 * @param next
 * @returns
 */
async function signUp(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    const { username, password, email, nickname, introduction } = req.body;

    // Validate fields
    if (!username || !password) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.MissingRequiredFields,
          400
        )
      );
    }

    // Validate nickname
    if (nickname && !isValidNickname(nickname)) {
      // console.log(nickname);
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.InvalidNickname, 400)
      );
    }

    // Validate email
    if (email && !isEmail(email)) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.InvalidEmail, 400)
      );
    }
    // Validate introduction
    if (introduction && !isValidIntroduction(introduction)) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.InvalidIntroduction, 400)
      );
    }

    // Validate password
    if (!isValidPassword(password)) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.InvalidPassword, 400)
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
      nickname,
      introduction || ""
    );

    // Filter password out
    const filteredResponseUser = {
      id: responseUser.id,
      username: responseUser.username,
      email: responseUser.email,
      nickname: responseUser.nickname,
      introduction: responseUser.introduction,
    };

    // Response with status 201
    res.status(201).json(filteredResponseUser);
  } catch (error) {
    console.error(error);
    next(new MiddlewareError("UnexpectedError", 500));
  }
}

async function signIn(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const { username, password } = req.body;
  if (!username || !password) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
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
  if (!PasswordUtils.compare(password, user.password)) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.IncorrectPassword, 400)
    );
  }

  // Success, create web token
  const token = await generateToken({
    id: user.id,
    generatedAt: new Date(),
  });
  res.json({ token: token.token });
}

async function getProfile(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Token not found
  if (!req["TokenRequest"]) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.NoTokenProvided, 400)
    );
  }

  // Not found a user, response unauthorized
  if (!req["UserRequest"]) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
    );
  }

  // Extract password from user request
  const userRequest: User = req["UserRequest"];
  const { username, email, nickname, id, introduction } = userRequest;
  // Response
  res.json({
    id,
    username,
    email,
    nickname,
    introduction,
    role: await userRequest.getRole(),
    permissions: await userRequest.getPermissions(),
  });
}
async function getUserFromId(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Get the user information
  const user = await UserController.getUserFromUUID(req.params.id);
  // Not found user
  if (!user) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.UserNotFound, 400)
    );
  }
  // Response a user information (username, nickname)
  res.json({
    id: user.id,
    username: user.username,
    nickname: user.nickname,
  });
}

async function getAllUsers(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const users = await UserController.getUsers();
  res.json(users);
}

async function updateProfile(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Token not found
  if (!req["TokenRequest"]) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.NoTokenProvided, 400)
    );
  }

  // Not found a user, response unauthorized
  if (!req["UserRequest"]) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
    );
  }

  // Extract user from request
  const userRequest: User = req["UserRequest"];
  const { nickname, introduction, email } = req.body;

  // Check for permission
  if (!userRequest.hasPermission(PermissionEnum.USER_UPDATE_PROFILE)) {
    return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
  }

  // remove check modified - tungls
  // // Whether provide nothing. Not modified
  // if (!nickname && !introduction) {
  //     return res.status(304).end();
  // }

  // Validate nickname
  if (nickname && !isValidNickname(nickname)) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.InvalidNickname, 400)
    );
  }
  // Validate introduction
  if (introduction && !isValidIntroduction(introduction)) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.InvalidIntroduction, 400)
    );
  }
  // Validate email
  if (email && !isEmail(email)) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.InvalidEmail, 400)
    );
  }

  // Update user
  await UserController.updateUserProfile(
    userRequest.id,
    nickname,
    introduction,
    email
  );

  // Response
  res.status(204).end();
}

async function updateUserPassword(req, res, next) {
  // Token is existed
  if (!req["TokenRequest"]) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.NoTokenProvided, 400)
    );
  }

  // Not found a user, response unauthorized
  if (!req["UserRequest"]) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
    );
  }

  // Extract user from request
  const userRequest: User = req["UserRequest"];
  const { oldPassword, confirmPassword, newPassword } = req.body;
  // await UserController.updateUserPassword(userRequest.id, newPassword);

  // Must exists all fields
  if (!oldPassword || !confirmPassword || !newPassword) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 400)
    );
  }

  // Check for permission
  if (!userRequest.hasPermission(PermissionEnum.USER_UPDATE_PROFILE)) {
    return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
  }

  // Check password
  if (!PasswordUtils.compare(oldPassword, userRequest.password)) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.IncorrectPassword, 400)
    );
  }

  // The new password with the current password must not be equal
  if (PasswordUtils.compare(newPassword, userRequest.password)) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.SamePassword, 400)
    );
  }

  // Check whether new password is valid
  if (!isValidPassword(newPassword)) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.InvalidPassword, 400)
    );
  }

  // Change password
  await UserController.updateUserPassword(userRequest.id, newPassword);
  // Response status
  res.status(204).end();
}

async function setPermissionGroupUser(req, res, next) {
  try {
    // Get user from token provided
    const userRequest: User = req["UserRequest"];
    // Not contains user
    if (!userRequest) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
      );
    }

    // If user is not admin, return forbidden
    if (
      !userRequest.hasPermission(PermissionEnum.ADMIN_UPDATE_PERMISSION_GROUP)
    ) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
      );
    }

    // Get from body userId and permissionId
    const { userId, permissionId } = req.body;
    if (!userId || !permissionId) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.MissingRequiredFields,
          400
        )
      );
    }

    // Check permissions
    await UserController.updatePermissionRole(userId, permissionId);

    res.status(204).end();
  } catch (err) {
    next(new MiddlewareError(err.message, 500));
  }
}

export const UserFunction = {
  signUp,
  signIn,
  getProfile,
  getUserFromId,
  getAllUsers,
  updateProfile,
  updateUserPassword,
  setPermissionGroupUser,
};
