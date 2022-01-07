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
async function createResourceMetadata(
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
 * Retrieves resource metadata from database.
 *
 * @param id a id of the resource to retrieves metadata
 * @returns a resource interface object
 */
async function getResourceMetadata(id: string): Promise<ResourceInterface> {
  // Check all parameters
  if (!id) {
    throw new Error("Missing parameters");
  }

  // Resource metadata
  const metadata = await DatabaseBuilder(Tables.Resource)
    .select()
    .where({ id })
    .first();

  // Return metadata of the file
  return metadata;
}
/**
 * Retrieves all resources from database
 * @param limit a limit of resources to retrieve
 * @returns an array of resource interface object
 */
async function getResources(
  limit?: number,
  offset?: number,
  orderBy?: string,
  order?: number
): Promise<ResourceInterface[]> {
  // Check valid limit parameter
  if (limit && !Number.isInteger(limit)) {
    throw new Error("Limit must be a integer");
  }

  // Resource metadata
  // Return metadata of the file
  return await DatabaseBuilder(Tables.Resource)
    .select()
    .limit(limit)
    .offset(offset)
    .orderBy(orderBy, order === 0 ? "asc" : "desc");

  // return resources;
}

/**
 * Update the metadata of a resource.
 *
 * @param id a id of the resource to update
 * @param name a name of the resource to update
 * @returns true whether the resource was updated, false otherwise
 */
async function updateResource(id: string, name: string): Promise<boolean> {
  // Check all parameters
  if (!id || !name) {
    throw new Error("Missing parameters");
  }

  // Resource metadata
  return (
    (await DatabaseBuilder(Tables.Resource).update({ name }).where({ id })) == 1
  );
}

async function deleteResource(id: string): Promise<boolean> {
  // Check all parameters
  if (!id) {
    throw new Error("Missing parameters");
  }

  // Resource metadata
  return (await DatabaseBuilder(Tables.Resource).delete().where({ id })) == 1;
}

/**
 * Export resource controller.
 */
const ResourceController = {
  createResourceMetadata,
  getResourceMetadata,
  getResources,
  updateResource,
  deleteResource, 
};
export default ResourceController;
