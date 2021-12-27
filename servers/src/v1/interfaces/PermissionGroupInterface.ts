export interface PermissionGroupInterface {
  id: number;
  name: string;
  description: string;
}

export enum PermissionGroupEnum {
  ADMIN = 1,
  USER,
  MOD,
}
