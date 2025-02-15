import { Tables } from '../Database';
import {
  ComicTagResponseInterface,
  ComicTagsResponseInterface,
} from '../interfaces/ComicTagInterface';
import DatabaseBuilder from '../utils/DatabaseBuilder';

/**
 * Creates tag, puts it into database, and returns the tag.
 *
 * @param keyword a keyword to represents tag search engine
 * @returns an object bare uuid and keyword
 */
async function createTag(keyword: string) {
  const tag = {
    keyword,
  };
  await DatabaseBuilder(Tables.ComicTag).insert(tag);
  return tag;
}

/**
 * Updates tag, and returns the tag.
 *
 * @param keyword a keyword to represents tag search engine
 * @returns an object bare uuid and keyword
 */
async function updateTag(id: number, keyword: string) {
  const tag = {
    id,
    keyword,
  };
  await DatabaseBuilder(Tables.ComicTag).update({ keyword }).where({ id });
  return tag;
}

/**
 * Deletes tag, and returns id of the deleted tag.
 *
 * @param id uuid of deleting tag
 * @returns an object bare uuid and keyword
 */
async function deleteTag(id: number) {
  await DatabaseBuilder(Tables.ComicTag).delete().where({ id });
  return id;
}

/**
 * Retrieves all tags from the database.
 *
 * @returns an array of object bare uuid and keyword
 */
async function getTags(): Promise<ComicTagsResponseInterface> {
  return await DatabaseBuilder(Tables.ComicTag).select();
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
async function getTagById(tagId: number) {
  return await DatabaseBuilder(Tables.ComicTag).where({ id: tagId }).first();
}

const ComicTagController = {
  createTag,
  updateTag,
  deleteTag,
  getTags,
  getTag,
  getTagById,
};
export default ComicTagController;
