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
 * @param tag an object containing tag information to search
 * @returns an object bare uuid and keyword
 */
async function getTag(
  tag: ComicTagRequestInterface
): Promise<ComicTagResponseInterface> {
  return await DatabaseBuilder(Tables.ComicTag)
    .where({ keyword: tag.keyword })
    .first();
}

const ComicTagController = {
  createTag,
  getTag,
};
export default ComicTagController;
