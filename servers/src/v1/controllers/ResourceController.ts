import { ResourceInterface } from "./../interfaces/ResourceInterface";
import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";
import validator from "validator";
import { v4 as uuid } from "uuid";

/**
 * Create new resource metadata into database.
 *
 * @param name a name of the resource, real name.
 * @param path a path of the resource
 * @param size a size of the resource
 * @param uploader who upload this resource
 */
async function createResource(
  name: string,
  path: string,
  size: number,
  uploader: string
): Promise<ResourceInterface> {
  // Check all parameters
  if (!name || !path || !size || !uploader) {
    throw new Error("Missing parameters");
  }

  // Uploader must be a uuid via validator
  if (!validator.isUUID(uploader)) {
    throw new Error("Uploader must be a uuid");
  }

  // Resource metadata
  const metadata = {
    id: uuid(), // Custom unique id
    name,
    path,
    size,
    uploader,
    uploadedAt: new Date(),
  };

  // Execute it
  await DatabaseBuilder(Tables.Resource).insert(metadata);

  // Return metadata of the file
  return metadata;
}

/**
 * Export resource controller.
 */
const ResourceController = {
  createResource,
};
export default ResourceController;
