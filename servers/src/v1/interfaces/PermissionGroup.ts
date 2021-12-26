export interface PermissionGroup {
  id: number;
  name: string;
  description: string;
}

export enum PermissionGroupEnum {
  Admin = "admin",
  User = "user",
}
