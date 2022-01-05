import validator from "validator";
import { Locale } from "./../Locale";
import { MiddlewareError } from "./../errors/MiddlewareError";
import express from "express";
import { getAuth } from "../middlewares/AuthMiddleware";
import multer from "multer";
import ImageUtils from "../utils/ImageUtils";
const router = express.Router();
import fs from "fs";

const upload = multer({
  dest: process.env.UPLOAD_DIR || "./uploads/",
});

router.post(
  `/`,
  getAuth,
  upload.array("files"),
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Upload files list extract
    const uploadedFiles: any = req.files;

    // Not found files
    if (!uploadedFiles || uploadedFiles.length === 0) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.MissingRequiredFields,
          404
        )
      );
    }

    uploadedFiles.forEach((file: Express.Multer.File) => {
      // Check is mime type
      if (!validator.isMimeType(file.mimetype)) {
        return next(
          new MiddlewareError(Locale.HttpResponseMessage.InvalidFileType, 400)
        );
      }

      // Check must be image types
      if (!ImageUtils.isImageType(file)) {
        return next(
          new MiddlewareError(Locale.HttpResponseMessage.InvalidFileType, 400)
        );
      }
    });

    // Process image
    Promise.all(
      uploadedFiles.map(async (file: any) => {
        return file;
      })
    ).then((f) => {
      console.log(f);
    });

    // ImageUtils.processImage(fs.readFileSync(file.path))
    // Handle the file before response,
    //  scale-down image and compress it
    res.json({
      files: req.files,
    });
  }
);

const ResourceRouter = router;
export default ResourceRouter;
