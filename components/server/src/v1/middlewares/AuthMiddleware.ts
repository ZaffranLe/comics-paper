import * as express from "express";
import * as jwt from "jsonwebtoken";
import validator from "validator";
import { User } from "../classes/User";
import { UserController } from "../controllers/UserController";
import { MiddlewareError } from "../errors/MiddlewareError";
import { Locale } from "../Locale";

/**
 * Retrieves a header that bearers token, process and call next middleware. Whether the token is not found, call next middleware
 * without set user response into request. User information contains in
 * req.UserRequest. req.TokenRequest contains token information.
 * req.PermissionRoleRequest contains permission role id.
 *
 * @param req a request object
 * @param res a response object
 * @param next a next middleware function
 * @returns handler promise to next middleware function
 */
export async function getAuth(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    // Check existence of token in header
    if (!req.headers.authorization) {
        // Next with empty body
        return next();
    }

    try {
        const token = req.headers.authorization.split(" ")[1];
        // Check if token is valid
        if (!validator.isJWT(token)) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.TokenNotJsonWebToken,
                    401
                )
            );
        }
        const data: any = jwt.verify(token, process.env.JWT_SECRET);
        // Get user information
        const userResponse: User = new User(
            await UserController.getUserFromUUID(data.id),
            data.id
        );

        // Set into request object
        req["UserRequest"] = userResponse;
        req["TokenRequest"] = token;

        // Call next middleware function
        next();
    } catch (err) {
        // Laziness gives me a headache
        next(
            new MiddlewareError(
                Locale.HttpResponseMessage.InvalidTokenOrExpired,
                401
            )
        );
    }
}

/**
 *
 * Requesting the authenticate by
 * checking <b>header['Authorization']</b> and
 * validate the provided token. If the token is
 * invalid or not found, response unauthorize http
 * response. Otherwise, calling the next function.
 *
 *
 * @param req a request from client that requesting to server
 * @param res a response that will be used
 * @param next function to invoke next middleware
 */
export async function requestAuthenticate(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
) {
    // Not found the token
    if (!req.headers.authorization) {
        return next(
            new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
        );
    }

    try {
        const token = req.headers.authorization.split(" ")[1];
        // Check if token is valid
        if (!validator.isJWT(token)) {
            return next(
                new MiddlewareError(
                    Locale.HttpResponseMessage.TokenNotJsonWebToken,
                    401
                )
            );
        }
        const data: any = jwt.verify(token, process.env.JWT_SECRET);
        // Get user information
        const userResponse: User = new User(
            await UserController.getUserFromUUID(data.id),
            data.id
        );

        // Set into request object
        req["UserRequest"] = userResponse;
        req["TokenRequest"] = token;

        // Call next middleware function
        next();
    } catch (err) {
        // Laziness gives me a headache
        next(
            new MiddlewareError(
                Locale.HttpResponseMessage.InvalidTokenOrExpired,
                401
            )
        );
    }
}
