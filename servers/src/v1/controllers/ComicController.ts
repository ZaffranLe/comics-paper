import { Tables } from "./../Database";
import { ComicInterface } from "../interfaces/ComicInterface";
import DatabaseBuilder from "../utils/DatabaseBuilder";
import { v4 as uuid } from "uuid";
import validator from "validator";
/**
 *
 * @param name a name of a comic
 * @param description a description of a comic
 * @param postedBy a user id who uploaded this comic
 * @returns
 */
async function createComic(
  name: string,
  description: string,
  postedBy: string
): Promise<ComicInterface> {
  const comic: ComicInterface = {
    id: uuid(),
    name,
    description,
    postedBy,
    createdAt: new Date(),
    updatedAt: new Date(),
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
    .update({ name, description });
}

const ComicController = {
  createComic,
  getComic,
  updateComic,
};
export default ComicController;
