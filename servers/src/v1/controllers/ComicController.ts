import { Tables } from "./../Database";
import { ComicInterface } from "../interfaces/ComicInterface";
import DatabaseBuilder from "../utils/DatabaseBuilder";
import { v4 as uuid } from "uuid";
import validator from "validator";
import slugify from "slugify";

/**
 * Create a new comic into database.
 *
 * @param name a name of a comic
 * @param description a description of a comic
 * @param postedBy a user id who uploaded this comic
 * @returns
 */
async function createComic(
  name: string,
  description: string,
  postedBy: string,
  thumbnail?: string
): Promise<ComicInterface> {
  const comic: ComicInterface = {
    id: uuid(),
    name,
    description,
    postedBy,
    thumbnail,
    createdAt: new Date(),
    updatedAt: new Date(),
    slug: slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }),
    likes: 0,
    views: 0,
  };

  await DatabaseBuilder(Tables.Comic).insert(comic);
  return comic;
}

/**
 *  Retrieves a comic by using it id
 * @param id a comic id
 * @returns the comic.
 *
 */
async function getComic(id: string): Promise<ComicInterface> {
  // check parameters
  if (!id || !validator.isUUID(id)) {
    throw new Error("id is required");
  }
  // Retrieve comic
  const comic = await DatabaseBuilder(Tables.Comic).where({ id }).first();
  return comic;
}

/**
 * Update a new comic by it id.
 *
 * @param id a comic id
 * @param name a name of a comic
 * @param description a description of comic
 */
async function updateComic(id: string, name: string, description: string) {
  // check parameters
  if (!id || !validator.isUUID(id)) {
    throw new Error("id is required");
  }
  // Retrieve comic
  await DatabaseBuilder(Tables.Comic)
    .where({ id })
    .update({
      name,
      description,
      updatedAt: new Date(),
      slug: slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }),
    });
}

/**
 * Remove a comic by its id.
 * @param id a comic id to delete
 */
async function deleteComic(id: string) {
  // check parameters
  if (!id || !validator.isUUID(id)) {
    throw new Error("id is required");
  }

  // Retrieve comic
  await DatabaseBuilder(Tables.Comic).where({ id }).del();
}

/**
 * Increase the number of views of a comic by 1.
 * @param id identify of the comic
 */
async function updateViewComic(id: string) {
  // check parameters
  if (!id || !validator.isUUID(id)) {
    throw new Error("id is required");
  }
  // Retrieve comic
  await DatabaseBuilder(Tables.Comic)
    .where({ id })
    .update({
      views: DatabaseBuilder.raw("views + 1"),
    });
}

/**
 * Check the comic existence.
 * @param id a comic id
 * @returns true if the comic exists, false otherwise.
 */
async function hasComic(id: string) {
  // check parameters
  if (!id || !validator.isUUID(id)) {
    throw new Error("id is required");
  }
  // Retrieve comic
  const comic = await DatabaseBuilder(Tables.Comic).where({ id }).first();
  return !!comic;
}

const ComicController = {
  createComic,
  getComic,
  updateComic,
  deleteComic,
  updateViewComic,
  hasComic,
};
export default ComicController;
