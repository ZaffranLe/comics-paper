import { ResourceInterface } from "./../interfaces/ResourceInterface";
import { PermissionEnum } from "./../interfaces/PermissionInterface";
import { User } from "./../classes/User";
import fs from "fs";
import { Locale } from "./../Locale";
import { MiddlewareError } from "./../errors/MiddlewareError";
import express from "express";
import { getAuth } from "../middlewares/AuthMiddleware";
import multer from "multer";
import path from "path";
import { v4 as uuid } from "uuid";
import ImageUtils from "../utils/ImageUtils";
import ResourceController from "../controllers/ResourceController";
import { ResourceFunction } from "./functions/ResourceFunction";
const router = express.Router();

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const uploadDirectory = process.env.UPLOAD_DIR || "./tmp/uploads/";

    // Make directory if not exists
    if (!fs.existsSync(uploadDirectory))
      fs.mkdirSync(uploadDirectory, { recursive: true });
    // Upload directory
    cb(null, uploadDirectory);
  },
  filename: (_req, file, cb) => {
    // Using uuid to generate a unique filename. Add with extension to avoid file name conflict.
    cb(null, `${uuid()}${path.extname(file.originalname)}`);
  },
});
const upload = multer({
  storage,
  fileFilter: (_req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = fileTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(Error(Locale.HttpResponseMessage.AcceptOnlyImage));
  },
});

router.get("/", getAuth, ResourceFunction.getAllResources);
router.post(
  `/`,
  getAuth,
  upload.array("files"),
  ResourceFunction.handleUploadResource
);
router.get(`/:id`, ResourceFunction.getBufferResource);
router.get(`/metadata/:id`, ResourceFunction.getMetadataResource);
router.put(`/metadata/:id`, getAuth, ResourceFunction.updateResource);
router.delete(`/:id`, getAuth, ResourceFunction.deleteResource);

const ResourceRouter = router;
export default ResourceRouter;
