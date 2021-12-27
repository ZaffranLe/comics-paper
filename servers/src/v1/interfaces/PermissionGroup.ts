export interface PermissionGroup {
  id: number;
  name: string;
  description: string;
}

export enum PermissionGroupEnum {
  ADMIN = 0,
  USER,
  MOD,
}
