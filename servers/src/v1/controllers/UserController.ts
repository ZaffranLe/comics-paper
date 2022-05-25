import { PermissionInterface } from "./../interfaces/PermissionInterface";
import {
    PermissionGroupEnum,
    PermissionGroupInterface,
} from "./../interfaces/PermissionGroupInterface";
import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";
import { UserResponseInterface, UsersResponseInterface } from "../interfaces/UserInterface";
import PasswordUtils from "../utils/PasswordUtils";
import comicController from "./ComicController";
import reviewController from "./ReviewController";
import commentController from "./ComicCommentController";

/**
 *  Create a native relation between user and permission group.
 *
 * @param userId a user identifier to get into the permission group
 * @param permissionGroup the permission group id
 * @returns
 */
async function createUserPermission(userId: number, permissionGroup: number) {
    return DatabaseBuilder.insert({ userId, permissionGroup }).into(Tables.UserPermission);
}

/**
 * Create new user.
 *
 * @param username a username of the user
 * @param password a password of the user
 * @param email an email of the user
 * @param nickname a nickname of the user
 * @param introduction a introduction of the user
 *
 * @returns a user interface which generated from database
 */
async function createUser(
    username: string,
    password: string,
    email?: string,
    nickname?: string,
    introduction?: string | "" // optional
) {
    // Hash a password, more secure (who dont want huh?)
    const hashedPassword = PasswordUtils.hash(password);

    // Creating new user
    const response: UserResponseInterface = {
        username,
        password: hashedPassword,
        email: email || null,
        nickname: nickname || null,
        introduction: introduction || null,
    };
    const insertedUser = await DatabaseBuilder.insert(response).into(Tables.User);
    await createUserPermission(insertedUser[0], PermissionGroupEnum.USER);

    return response;
}

/**
 * Retrieves user via their id. Whether not found is return null.
 *  NOTE: This function will also return a hashed password of the user.
 *      Please ensure that fetch the password before response to client
 * @param id a id of the user
 * @returns a user whether exists, null otherwise.
 */
async function getUserFromUUID(id: string): Promise<UserResponseInterface> {
    // parameter error
    if (!id) {
        throw new Error("Invalid user uuid parameter");
    }

    // select from database
    const user = await DatabaseBuilder(Tables.User).select().where({ id }).first();
    if (user == null) {
        return null;
    }

    return {
        id: user.id,
        username: user.username,
        password: user.password,
        email: user.email,
        nickname: user.nickname,
        introduction: user.introduction,
    };
}

/**
 * Retrieves all users.
 * @returns an array of users.
 */
async function getUsers(): Promise<UsersResponseInterface> {
    // select from database
    const users = await DatabaseBuilder(Tables.User).select([
        "id",
        "username",
        "email",
        "nickname",
        "introduction",
    ]);

    return users;
}

/**
 * Check whether the user exists.
 *
 * @param id a unique id of the user
 * @returns true whether exists, false otherwise
 */
async function hasUserByUUID(id: number) {
    // undefined id or null string
    if (!id) {
        throw new Error("Invalid user uuid parameter");
    }
    const user = await DatabaseBuilder(Tables.User).select().where({ id }).first();
    return user != null;
}

/**
 * Check whether the user exists.
 * @param username a username of the user
 * @returns true whether exists, false otherwise
 */
async function hasUserByUsername(username: string) {
    // undefined username or null string
    if (!username) {
        throw new Error("Invalid username parameter");
    }
    const user = await DatabaseBuilder(Tables.User).select().where({ username }).first();
    return user != null;
}

/**
 * Retrieves a user from it username.
 * @param username a username of the user
 * @returns a user whether exists, null otherwise
 */
async function getUserFromUsername(username: string) {
    if (!username) {
        throw new Error("Invalid username parameter");
    }
    return await DatabaseBuilder(Tables.User).select().where({ username }).first();
}

/**
 * Retrieves a permission group from provided user.
 * @param userId a user identifier
 * @returns a permission group interface
 *
 */
async function getPermissionGroupFromUserId(userId: number): Promise<PermissionGroupInterface> {
    // Must not be empty and format of uuid
    if (!userId) {
        throw new Error("Invalid user id parameter");
    }
    const response = await DatabaseBuilder(Tables.UserPermission)
        // .select("id", "name", "description")
        // select full name  (contains table name)
        .select(
            `${Tables.PermissionGroup}.id`,
            `${Tables.PermissionGroup}.name`,
            `${Tables.PermissionGroup}.description`
        )
        .where({ userId })
        .innerJoin(
            Tables.PermissionGroup,
            `${Tables.UserPermission}.permissionGroup`,
            `${Tables.PermissionGroup}.id`
        )
        .first();
    // Return
    return response;
}

/**
 * Get all permissions from provided user.
 * Permissions required from permission group (role) of user.
 *
 * @param userId a user identifier (uuid) to get permissions
 * @returns a permission list from provided user
 */
async function getAllPermissionsFromUserId(userId: number) {
    // Must not be empty and format of uuid
    if (!userId) {
        throw new Error("Invalid user id parameter");
    }
    // Select the user group
    const selectUserGroupQuery = DatabaseBuilder(Tables.UserPermission)
        .select(`up.permissionGroup`)
        .from({ up: Tables.UserPermission })
        .where({ "up.userId": userId });

    // Select the permission from a group
    const selectPermissionsFromGroupQuery = await DatabaseBuilder(Tables.Permission)
        .select({
            PermissionId: "p.id",
            PermissionName: "p.name",
            PermissionDescription: "p.description",
        })
        .from({ pr: Tables.PermissionRelationship })
        .innerJoin({ p: Tables.Permission }, "pr.permissionId", "p.id")
        .where({ "pr.permissionGroup": selectUserGroupQuery });

    // Return as an interface array
    const response: PermissionInterface[] = selectPermissionsFromGroupQuery.map(
        ({ PermissionId, PermissionName, PermissionDescription }) => {
            return {
                id: PermissionId,
                name: PermissionName,
                description: PermissionDescription,
            };
        }
    );
    return response;
}

/**
 * Check permission by provide it an id of user and permission.
 *
 * @param userId a user identifier to get permissions
 * @param permissionId a permission identifier to check
 * @returns true whether user permitted that permission, false otherwise;
 */
async function hasPermissionByUserId(userId: number, permissionId: number): Promise<boolean> {
    // Must not be empty and format of uuid
    if (!userId) {
        throw new Error("Invalid user id parameter");
    }

    // Must not be empty
    if (!permissionId) {
        throw new Error("Invalid permission id parameter");
    }

    // Select the user group
    const selectUserGroupQuery = DatabaseBuilder(Tables.UserPermission)
        .select(`up.permissionGroup`)
        .from({ up: Tables.UserPermission })
        .where({ "up.userId": userId });

    // Select the permission from a group
    const response = await DatabaseBuilder(Tables.Permission)
        .select({
            PermissionId: "p.id",
            PermissionName: "p.name",
            PermissionDescription: "p.description",
        })
        .from({ pr: Tables.PermissionRelationship })
        .innerJoin({ p: Tables.Permission }, "pr.permissionId", "p.id")
        .where({
            "pr.permissionGroup": selectUserGroupQuery,
            "p.id": permissionId,
        })
        .first();

    // Return as an interface array
    return response != null;
}

/**
 * Update user profile.
 *
 * @param userId a user identifier to change
 * @param nickname a new nickname
 * @param introduction a new introduction
 * @returns a rows affected.
 */
async function updateUserProfile(
    userId: number,
    nickname: string,
    introduction: string,
    email: string
) {
    // Validate identifier
    if (!userId) {
        throw new Error("Invalid user id parameter");
    }

    // Check user existence
    if (!(await hasUserByUUID(userId))) {
        throw new Error("User not found");
    }

    // Update user profile
    return await DatabaseBuilder(Tables.User)
        .update({
            nickname,
            introduction,
            email,
        })
        .where({ id: userId });
}

/**
 * Change the current password of user.
 * @param uuid a identifier of user to change password
 * @param password a new password
 * @returns true whether changed, false otherwise
 */
async function updateUserPassword(id: number, password: string) {
    // Validate identifier
    if (!id) {
        throw new Error("Invalid user uuid parameter");
    }

    // Check user existence
    if (!(await hasUserByUUID(id))) {
        throw new Error("User not found");
    }

    // Using bcrypt to hash password
    const hashedPassword = PasswordUtils.hash(password);

    // Update user profile
    return (
        (await DatabaseBuilder(Tables.User)
            .update({
                password: hashedPassword,
            })
            .where({ id: id })) == 1
    );
}

/**
 * Updates a permission group to user.
 * @param userId a user identifier to grant a group
 * @param permissionRole a permission group identifier to grant
 */
async function updatePermissionRole(userId: number, permissionRole: number) {
    // Update a permission group to user
    return await DatabaseBuilder(Tables.UserPermission)
        .update({ permissionGroup: permissionRole })
        .where({ userId });
}

async function getUserDetail(userId: string) {
    const user = await getUserFromUUID(userId);
    delete user.password;
    const comics = await comicController.getComicByUser(userId);
    const reviews = await reviewController.getReviewsByUserId(userId);
    const comments = await commentController.getCommentByUserId(userId);
    return {
        user,
        comics,
        reviews,
        comments,
    };
}

export const UserController = {
    createUserPermission,
    createUser,
    getUserFromUUID,
    getUsers,
    hasUserByUUID,
    hasUserByUsername,
    getUserFromUsername,
    getPermissionGroupFromUserId,
    getAllPermissionsFromUserId,
    hasPermissionByUserId,
    updateUserProfile,
    updateUserPassword,
    updatePermissionRole,
    getUserDetail,
};
