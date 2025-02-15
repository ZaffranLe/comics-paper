import { PermissionInterface } from './PermissionInterface';
import { PermissionGroupInterface } from './PermissionGroupInterface';

export interface PermissionRelationshipInterface {
  permissionGroup: PermissionGroupInterface;
  permission: PermissionInterface;
}
