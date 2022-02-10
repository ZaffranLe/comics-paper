import fs from "fs";
import { ResourceInterface } from "./../../interfaces/ResourceInterface";
import express from "express";
import { PermissionEnum } from "./../../interfaces/PermissionInterface";
import { Locale } from "./../../Locale";
import { MiddlewareError } from "./../../errors/MiddlewareError";
import ResourceController from "./../../controllers/ResourceController";
import { User } from "../../classes/User";
import ImageUtils from "../../utils/ImageUtils";

async function getAllResources(req, res, next) {
  try {
    const user = await req["UserRequest"];

    // Check authorization
    if (!user) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Unauthorized, 401)
      );
    }

    // Check user permission to access all resources
    if (!(await user.hasPermission(PermissionEnum.RESOURCE_ACCESS_ALL))) {
      return next(
        new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403)
      );
    }

    // Get limit and offset
    const limit = parseInt(req.query.limit as any) || 10;
    const page = parseInt(req.query.page as any) || 0;
    const orderBy = (req.query.orderBy as string) || "uploadedAt";
    const order = req.query.order as string;

    // Retrieve all resources
    const resources = await ResourceController.getResources(
      limit,
      page,
      orderBy,
      order
    );

    const length = (await ResourceController.countAllResources())[0][
      "count(*)"
    ];
    // Debug out
    console.log(
      `[resources] fetch all resource by filter limit ${limit}, page ${page}, orderBy ${orderBy}, order ${order}`
    );
    console.log(`[resources] total ${length}`);
    res.status(200).json({
      length: length,
      resources: resources,
    });
  } catch (err) {
    next(new MiddlewareError(err.message, 500));
  }
}

async function handleUploadResource(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Upload files list extract
  const uploadedFiles: any = req.files;
  const user: User = req["UserRequest"];

  // Not found files
  if (!uploadedFiles || uploadedFiles.length === 0) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 404)
    );
  }

  // Check permission
  if (!(await user.hasPermission(PermissionEnum.RESOURCE_CREATE))) {
    return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
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

async function getBufferResource(req, res, next) {
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
}

async function getMetadataResource(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  // Pre-process req.params.id
  if (!req.params.id) {
    return next(
      new MiddlewareError(Locale.HttpResponseMessage.MissingRequiredFields, 404)
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

async function updateResource(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
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
    return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
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

async function deleteResource(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
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
    return next(new MiddlewareError(Locale.HttpResponseMessage.Forbidden, 403));
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
    console.info(`[resource] delete resource ${id} from path ${resource.path}`);
    res.status(200).json({ id });
  } catch (err) {
    next(new MiddlewareError(err.message, 500));
  }
}

export const ResourceFunction = {
  getAllResources,
  handleUploadResource,
  getBufferResource,
  getMetadataResource,
  updateResource,
  deleteResource,
};
