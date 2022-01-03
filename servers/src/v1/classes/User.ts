import { UserInterface } from "./../interfaces/UserInterface";
import validator from "validator";
import { UserController } from "../controllers/UserController";
import { PermissionGroupInterface } from "../interfaces/PermissionGroupInterface";

export class User implements UserInterface {
  id: string;
  username: string;
  password: string;
  email: string;
  nickname: string;

  constructor(user: UserInterface, id?: string) {
    this.id = id;
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
    this.nickname = user.nickname;

    // Validate email
    if (!validator.isEmail(this.email)) {
      throw new Error("Invalid email");
    }

    // Validate nickname
    if (!validator.isLength(this.nickname, { min: 3, max: 20 })) {
      throw new Error("Invalid nickname");
    }
  }

  /**
   * Check whether the user has a permission.
   * @param permissionId a permission identifier.
   * @returns true whether the user has the given permission, false otherwise.
   */
  async hasPermission(permissionId: number): Promise<boolean> {
    return UserController.hasPermissionByUserId(this.id, permissionId);
  }

  /**
   * Retrieves a current role of user.
   * @returns a permission group of the user.
   */
  async getRole(): Promise<PermissionGroupInterface> {
    return await UserController.getPermissionGroupFromUserId(this.id);
  }

  /**
   * Retrieves all permissions of user.
   * @returns an array of permissions of the user.
   */
  async getPermissions(): Promise<PermissionGroupInterface[]> {
    return await UserController.getAllPermissionsFromUserId(this.id);
  }
}
