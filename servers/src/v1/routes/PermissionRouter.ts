import { User } from "./../classes/User";
import { Locale } from "./../Locale";
import { MiddlewareError } from "./../errors/MiddlewareError";
import express from "express";
import { PermissionController } from "../controllers/PermissionController";
import { PermissionGroupController } from "../controllers/PermissionGroupController";
import { getAuth } from "../middlewares/AuthMiddleware";
import { PermissionEnum } from "../interfaces/PermissionInterface";
import { PermissionRelationshipController } from "../controllers/PermissionRelationshipController";
import { PermissionFunction } from "./functions/PermissionFunction";
const router = express.Router();

/**
 * Retrieves all permissions from the database.
 */
router.get("/", PermissionFunction.getAllPermissions);
/**
 * Retrieves a roles in system
 */
router.get(`/roles`, PermissionFunction.getAllRoles);

router.get(`/roles/:roleId`, PermissionFunction.getRoleById);

router.post(`/roles`, getAuth, PermissionFunction.createNewRole);

router.post(`/roles/grant`, getAuth, PermissionFunction.grantPermissionToRole);
/**
 * Revokes permissions from group
 */
router.delete(
  `/roles/revoke`,
  getAuth,
  PermissionFunction.revokePermissionsFromGroup
);
export const PermissionRouter = router;
