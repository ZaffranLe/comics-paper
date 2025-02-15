import express from "express";
import { getAuth, requestAuthenticate } from "../middlewares/AuthMiddleware";
import { PermissionFunction } from "./functions/PermissionFunction";
const router = express.Router();

/**
 * Retrieves all permissions from the database.
 */
router.get("/", requestAuthenticate, PermissionFunction.getAllPermissions);
/**
 * Retrieves a roles in system
 */
router.get(`/roles`, requestAuthenticate, PermissionFunction.getAllRoles);

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
