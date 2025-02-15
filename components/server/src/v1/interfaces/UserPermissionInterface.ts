import { UserInterface } from './UserInterface';
import { PermissionGroupInterface } from './PermissionGroupInterface';

export interface UserPermissionInterface {
  user: UserInterface;
  permissionGroup: PermissionGroupInterface;
}
