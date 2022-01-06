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

router.post(
  `/`,
  getAuth,
  upload.array("files"),
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Upload files list extract
    const uploadedFiles: any = req.files;
    const user: User = req["UserRequest"];

    // Not found files
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.MissingRequiredFields,
          404
        )
      );
    }

    // Check permission
    if (!(await user.hasPermission(PermissionEnum.RESOURCE_CREATE))) {
      console.info(
        `[resource permission] current role of this user ${
          (await user.getRole()).name
        }`
      );

      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
      );
    }

    // Process image
    Promise.all(
      uploadedFiles.map(async (file: Express.Multer.File) => {
        const outBuffer = await ImageUtils.processImage(
          fs.readFileSync(file.path)
        );
        // Write back buffer
        fs.writeFileSync(file.path, outBuffer);

        // Then start to create resource and put it into database
        const { originalname, path } = file;
        const size = outBuffer.length;

        // Retrieves a response
        const resource: ResourceInterface =
          await ResourceController.createResource(
            originalname,
            path,
            size,
            user.id
          );

        // Hide path
        const { id, name, uploadedAt, uploader } = resource;
        // Return to all promises
        return { id, name, uploadedAt, uploader, size };
      })
    )
      .then((metadataList) => {
        // Response to client
        res.status(201).json(metadataList);
      })
      // Catch the error
      .catch(next);

    // Handle the file before response,
    //  scale-down image and compress it
    // res.json({
    //   files: req.files,
    // });
  }
);

const ResourceRouter = router;
export default ResourceRouter;
