import express from "express";
import { getAuth } from "../middlewares/AuthMiddleware";
import { UserFunction } from "./functions/UserFunction";
const router = express.Router();

router.get(`/profile`, getAuth, UserFunction.getProfile);

router.post(`/signup`, UserFunction.signUp);
router.post(`/signin`, UserFunction.signIn);
router.post(`/permissions/`, getAuth, UserFunction.setPermissionGroupUser);

router.put(`/profile`, getAuth, UserFunction.updateProfile);
router.put(`/change-password`, getAuth, UserFunction.updateUserPassword);
router.get(`/`, getAuth, UserFunction.getAllUsers);

router.get("/:id", UserFunction.getUserFromId);

router.get("/detail/:id", UserFunction.getUserDetail);

const UserRouter = router;
export default UserRouter;
