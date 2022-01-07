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

/**
 * Retrieves all resources, need permissions
 */
router.get("/", getAuth, async (req, res, next) => {
  const user = await req["UserRequest"];

  // Check authorization
  if (!user) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
    );
  }

  // Check user permission to access all resources
  if (!(await user.hasPermission(PermissionEnum.RESOURCE_ACCESS_ALL))) {
    return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
  }

  // Get limit and offset
  const limit = parseInt(req.query.limit as any) || 10;
  const offset = parseInt(req.query.offset as any) || 0;
  const orderBy = (req.query.orderBy as string) || "uploadedAt";
  const order = (req.query.order as any) || 0;

  try {
    // Retrieve all resources
    const resources = await ResourceController.getResources(
      limit,
      offset,
      orderBy,
      order
    );
    // Debug out
    console.log(
      `[resources] fetch all resource by filter limit ${limit}, offset ${offset}, orderBy ${orderBy}, order ${order}`
    );
    res.status(200).json(resources);
  } catch (err) {
    next(new MiddlewareError(err.message, 500));
  }
});
/**
 * Upload a resource.
 */
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
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
      );
    }

    // Process image
    Promise.all(
      uploadedFiles.map(async (file: Express.Multer.File) => {
        // Handle image
        console.log(`[resources] handling uploaded file ${file.originalname}`);
        const outBuffer = await ImageUtils.processImage(
          fs.readFileSync(file.path)
        );

        // Write back buffer
        console.log(`[resources] writing file into ${file.path}`);
        fs.writeFileSync(file.path, outBuffer);

        // Then start to create resource and put it into database
        const { originalname, path } = file;
        const size = outBuffer.length;

        // Retrieves a response
        console.log(
          `[resources] generate file ${file.originalname} into database`
        );
        const resource: ResourceInterface =
          await ResourceController.createResourceMetadata(
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
  }
);
/**
 * Get a resource as buffer
 */
router.get(`/:id`, async (req, res, next) => {
  const { id } = req.params;
  const resourceMetadata = await ResourceController.getResourceMetadata(id);

  // Resource not found
  if (!resourceMetadata) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.ResourceNotFound, 404)
    );
  }

  // Then write a file from path
  const data: Buffer = fs.readFileSync(resourceMetadata.path);
  res.end(data);
});

/**
 * Get resource metadata with id
 */
router.get(
  `/metadata/:id`,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Pre-process req.params.id
    if (!req.params.id) {
      return next(
        new MiddlewareError(
          Locale.HttpResponseMessage.MissingRequiredFields,
          404
        )
      );
    }

    // Retrieves a response
    const resource: ResourceInterface =
      await ResourceController.getResourceMetadata(req.params.id);

    // Not found resource
    if (!resource) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.ResourceNotFound, 404)
      );
    }
    // Hide path
    const { id, name, uploadedAt, uploader, size } = resource;

    // Return to all promises
    res.status(200).json({ id, name, uploadedAt, uploader, size });
  }
);

/**
 * Edit resource metadata
 */
router.put(
  `/metadata/:id`,
  getAuth,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Get user
    const user = await req["UserRequest"];

    // Authorization required
    if (!user) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
      );
    }

    // Check permission
    if (!(await user.hasPermission(PermissionEnum.RESOURCE_UPDATE))) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
      );
    }

    // Take parameter from body
    const { id } = req.params;
    const { name } = req.body;

    // Resource check
    const resource = await ResourceController.getResourceMetadata(id);
    if (!resource) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.ResourceNotFound, 404)
      );
    }

    try {
      // Update resource metadata
      await ResourceController.updateResource(id, name);
      res.status(201).json({ id, name });
    } catch (err) {
      next(new MiddlewareError(err.message, 500));
    }
  }
);

/***
 *  Delete resource
 *
 */
router.delete(
  `/:id`,
  getAuth,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    // Get user
    const user = await req["UserRequest"];

    // Authorization required
    if (!user) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
      );
    }

    // Check permission
    if (!(await user.hasPermission(PermissionEnum.RESOURCE_DELETE))) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
      );
    }

    // Take parameter from body
    const { id } = req.params;
    // Resource check
    const resource = await ResourceController.getResourceMetadata(id);
    if (!resource) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.ResourceNotFound, 404)
      );
    }

    try {
      // Delete resource
      await ResourceController.deleteResource(id);
      // Before response, unlink the file in the file system
      fs.unlinkSync(resource.path);
      // Debug out this method
      console.info(
        `[resource] delete resource ${id} from path ${resource.path}`
      );
      res.status(200).json({ id });
    } catch (err) {
      next(new MiddlewareError(err.message, 500));
    }
  }
);

const ResourceRouter = router;
export default ResourceRouter;
