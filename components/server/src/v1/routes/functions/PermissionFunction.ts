import express from 'express';
import { User } from '../../classes/User';
import { PermissionController } from '../../controllers/PermissionController';
import { PermissionGroupController } from '../../controllers/PermissionGroupController';
import { PermissionRelationshipController } from '../../controllers/PermissionRelationshipController';
import { MiddlewareError } from '../../errors/MiddlewareError';
import { PermissionEnum } from '../../interfaces/PermissionInterface';
import { Locale } from '../../Locale';

const getAllPermissions = async (req, res, next) => {
  try {
    // Send all permissions here
    res.json(await PermissionController.getPermissions());
  } catch (err) {
    next(new MiddlewareError(err.message, 500));
  }
};

const getAllRoles = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  /**
   * Get all roles (permission group from database)
   */

  res.json(await PermissionGroupController.getAllPermissionGroups());
};

const getRoleById = async (req, res, next) => {
  /**
   * Get a specific role (permission group from database)
   */

  const roleId = req.params.roleId as any;
  if (!roleId) {
    return next(
      new MiddlewareError(
        Locale.HttpResponseMessage.MissingRequiredFields,
        400,
      ),
    );
  }

  const permissions =
    await PermissionGroupController.getPermissionsByGroup(roleId);

  res.json(
    permissions.map((permission) => {
      return {
        id: permission.PermissionId,
        name: permission.PermissionName,
        description: permission.PermissionDescription,
      };
    }),
  );
};

const createNewRole = async (req, res, next) => {
  try {
    /**
     * Get authorization and permissions for create a role
     */
    const user: User = req['UserRequest'];

    // Unauthorized
    if (!user) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401),
      );
    }

    // Forbidden
    if (
      !(await user.hasPermission(PermissionEnum.ADMIN_CREATE_PERMISSION_GROUP))
    ) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403),
      );
    }
    /**
     * Create a new role (permission group)
     */
    const roleName = req.body.name as string;
    const roleDescription = req.body.description as string;
    if (!roleName || !roleDescription) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.MissingRequiredFields,
          400,
        ),
      );
    }

    // Has this permission group
    if (await PermissionGroupController.hasPermissionGroupByName(roleName)) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.PermissionGroupExists,
          409,
        ),
      );
    }

    const response = await PermissionGroupController.createPermissionGroup(
      null,
      roleName,
      roleDescription,
    );

    res.json(response);
  } catch (err) {
    next(new MiddlewareError(err.message, 500));
  }
};

const grantPermissionToRole = async (req, res, next) => {
  try {
    /**
     * Get authorization and permissions for create a role
     */
    const user: User = req['UserRequest'];

    // Unauthorized
    if (!user) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401),
      );
    }

    // Forbidden
    if (!(await user.hasPermission(PermissionEnum.GRANT_PERMISSION_TO_GROUP))) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403),
      );
    }

    const permissionGroupId = req.body.permissionGroupId as any;
    const permissionId = req.body.permissionId as any;
    if (!permissionGroupId || !permissionId) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.MissingRequiredFields,
          400,
        ),
      );
    }

    // Check existence of permissionId and permissionGroupId
    if (!(await PermissionController.hasPermission(permissionId))) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.PermissionNotExists,
          404,
        ),
      );
    }

    if (
      !(await PermissionGroupController.hasPermissionGroup(permissionGroupId))
    ) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.PermissionGroupNotExists,
          404,
        ),
      );
    }

    await PermissionRelationshipController.addRelation(
      permissionId,
      permissionGroupId,
    );

    res.status(204).end();
  } catch (err) {
    next(new MiddlewareError(err.message, 500));
  }
};

const revokePermissionsFromGroup = async (req, res, next) => {
  try {
    const permissionGroupId = req.body.permissionGroupId as any;
    const permissionId = req.body.permissionId as any;
    if (!permissionGroupId || !permissionId) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.MissingRequiredFields,
          400,
        ),
      );
    }

    // Check existence of permissionId and permissionGroupId
    if (!(await PermissionController.hasPermission(permissionId))) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.PermissionNotExists,
          404,
        ),
      );
    }

    if (
      !(await PermissionGroupController.hasPermissionGroup(permissionGroupId))
    ) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.PermissionGroupNotExists,
          404,
        ),
      );
    }

    await PermissionRelationshipController.removeRelationship(
      permissionId,
      permissionGroupId,
    );

    res.status(204).end();
  } catch (err) {
    next(new MiddlewareError(err.message, 500));
  }
};

export const PermissionFunction = {
  getAllPermissions,
  getAllRoles,
  getRoleById,
  createNewRole,
  grantPermissionToRole,
  revokePermissionsFromGroup,
};
