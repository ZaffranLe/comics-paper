import { ResourceInterface } from "./../interfaces/ResourceInterface";
import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";

/**
 * Create new resource metadata into database.
 *
 * @param originalName a name of the resource, real name.
 * @param path a path of the resource
 * @param size a size of the resource
 * @param uploader who upload this resource
 */
async function createResourceMetadata(
    originalName: string,
    fileName: string,
    path: string,
    size: number,
    uploader: number
): Promise<ResourceInterface> {
    // Check all parameters
    if (!originalName || !fileName || !path || !size || !uploader) {
        throw new Error("Missing parameters");
    }

    // Resource metadata
    const metadata = {
        originalName,
        fileName,
        path,
        size,
        uploader,
        uploadedAt: new Date(),
    };

    // Execute it
    const insertedResource = await DatabaseBuilder(Tables.Resource).insert(metadata);

    // Return metadata of the file
    return { ...metadata, id: insertedResource[0] };
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
    const metadata = await DatabaseBuilder(Tables.Resource).select().where({ id }).first();

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
    page?: number,
    orderBy?: string,
    order?: string
): Promise<ResourceInterface[]> {
    // Check valid limit parameter
    if (limit && !Number.isInteger(limit)) {
        throw new Error("Limit must be a integer");
    }

    // Check valid page parameter
    if (page && !Number.isInteger(page)) {
        throw new Error("Page must be a integer");
    }

    // Page must higher than 0
    if (page && page < 0) {
        throw new Error("Page must be higher than 0");
    }

    // Check valid order parameter
    if (order && !["asc", "desc"].includes(order)) {
        throw new Error("Order must be asc or desc");
    }

    // Resource metadata
    // Return metadata of the file
    return await DatabaseBuilder(Tables.Resource)
        .select()
        .limit(limit)
        .offset(page * limit)
        .orderBy(orderBy, order);
}

/**
 * Retrieves number of resources contain in database.
 * @returns a number of resources contain in database.
 */
async function countAllResources(): Promise<number> {
    return await DatabaseBuilder(Tables.Resource).count();
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
    return (await DatabaseBuilder(Tables.Resource).update({ name }).where({ id })) == 1;
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
 * Check whether a resource exists or not.
 *
 * @param id a id of the resource to check
 * @returns true whether the resource existed, false otherwise
 */
async function hasResource(id: number): Promise<boolean> {
    // Check all parameters
    if (!id) {
        throw new Error("Missing parameters");
    }

    // Resource metadata
    return (await DatabaseBuilder(Tables.Resource).where({ id }).first()) != null;
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
    hasResource,
    countAllResources,
};
export default ResourceController;
