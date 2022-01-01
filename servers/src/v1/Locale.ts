export const Locale = {
  PermissionGroup: {
    Admin: { Name: "Admin", Description: "Administrator permissions" },
    User: { Name: "User", Description: "User permissions" },
    Mod: { Name: "Mod", Description: "Mod permissions" },
  },
  Permission: {
    AdminCreateUser: {
      Name: "admin_create_user",
      Description: "Admin create new user",
    },

    AdminDeleteUser: {
      Name: "admin_delete_user",
      Description: "Admin delete user",
    },

    AdminUpdateUser: {
      Name: "admin_update_user",
      Description: "Admin update user",
    },

    AdminCreatePermissionGroup: {
      Name: "admin_create_permission_group",
      Description: "Admin create new permission group",
    },

    AdminDeletePermissionGroup: {
      Name: "admin_delete_permission_group",
      Description: "Admin delete permission group",
    },

    AdminUpdatePermissionGroup: {
      Name: "admin_update_permission_group",
      Description: "Admin update permission group",
    },
  },
  HttpResponseMessage: {
    MissingRequiredFields: "Missing required fields.",
    InvalidNickname:
      "Invalid nickname. It must contain only letters, numbers, dots, and underscores.",
    InvalidEmail: "Invalid email.",
    UserAlreadyExists: "User already exists.",
    UserNotFound: "User not found.",
    IncorrectPassword: "Incorrect password.",
    NoTokenProvided: "No token provided in header.",
    TokenNotJsonWebToken: "Token is not a JsonWebToken (invalid)",
    Unauthorized: "Unauthorized."
  },
};
