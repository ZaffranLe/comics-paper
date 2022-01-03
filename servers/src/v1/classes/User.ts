import { UserInterface } from "./../interfaces/UserInterface";
import validator from "validator";
import { UserController } from "../controllers/UserController";
import { PermissionGroupInterface } from "../interfaces/PermissionGroupInterface";
import { isValidIntroduction, isValidNickname } from "../utils/ValidatorUtils";
import { Locale } from "../Locale";

export class User implements UserInterface {
  id: string;
  username: string;
  password: string;
  email: string;
  nickname: string;
  introduction: string;

  constructor(user: UserInterface, id?: string) {
    this.id = id;
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
    this.nickname = user.nickname;
    this.introduction = user.introduction;
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

  async changeProfile(nickname: string, introduction: string) {
    // Nickname is valid or not
    if (!isValidNickname(nickname)) {
      throw new Error(Locale.HttpResponseMessage.InvalidNickname);
    }

    // Introduction is valid or not
    if (!isValidIntroduction(introduction)) {
      throw new Error(Locale.HttpResponseMessage.InvalidIntroduction);
    }

    // Update user profile
  }
}
