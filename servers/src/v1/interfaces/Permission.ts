import { PermissionGroup } from "./PermissionGroup";

export interface Permission {
  id: number;
  permissionGroup: PermissionGroup;
  name: string;
  description: string;
}
