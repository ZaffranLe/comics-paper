import {
  ComicTagRequestInterface,
  ComicTagResponseInterface,
} from "./../interfaces/ComicTagInterface";
import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";
import { v4 as uuid } from "uuid";

/**
 * Creates tag, puts it into database, and returns the tag.
 *
 * @param keyword a keyword to represents tag search engine
 * @returns an object bare uuid and keyword
 */
async function createTag(keyword: string) {
  const tag = {
    id: uuid(),
    keyword,
  };
  await DatabaseBuilder(Tables.ComicTag).insert(tag);
  return tag;
}

/**
 * Retrieves a tag from the database.
 *
 * @param keyword a keyword of tag to search for.
 * @returns an object bare uuid and keyword
 */
async function getTag(keyword: string): Promise<ComicTagResponseInterface> {
  return await DatabaseBuilder(Tables.ComicTag).where({ keyword }).first();
}
/**
 * Retrieves a specific tag from the database by provided id.
 * @param tagId a tag identifier to search for tags
 * @returns a tag object, null if not found.
 */
async function getTagById(tagId: string) {
  return await DatabaseBuilder(Tables.ComicTag).where({ id: tagId }).first();
}

const ComicTagController = {
  createTag,
  getTag,
  getTagById,
};
export default ComicTagController;
