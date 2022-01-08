export interface PermissionInterface {
  id: number;
  name: string;
  description: string;
}

export enum PermissionEnum {
  // Users
  ADMIN_CREATE_USER = 1,
  ADMIN_DELETE_USER,
  ADMIN_UPDATE_USER,
  // Permission groups
  ADMIN_CREATE_PERMISSION_GROUP,
  ADMIN_DELETE_PERMISSION_GROUP,
  ADMIN_UPDATE_PERMISSION_GROUP,

  // Role permission
  ROLE_UPDATE,
  ROLE_DELETE,
  ROLE_CREATE,

  // User
  USER_ROLE_CHANGE,
  USER_UPDATE_PROFILE,

  // Resource
  RESOURCE_CREATE,
  RESOURCE_UPDATE,
  RESOURCE_ACCESS_ALL,
  RESOURCE_DELETE,

  // Comic
  COMIC_CREATE,
  COMIC_UPDATE,
  COMIC_DELETE,

  // Comic chapter
  COMIC_CHAPTER_CREATE,
}
