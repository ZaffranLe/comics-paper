export interface PermissionGroup {
  id: number;
  name: string;
  description: string;
}

export enum PermissionGroupEnum {
  ADMIN = 1,
  USER,
  MOD,
}
