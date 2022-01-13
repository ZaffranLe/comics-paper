import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";

/**
 * Creates tag reference objects.
 *
 * @param comicId a comic tag identifier to create reference
 * @param tagId a tag identifier to create reference
 */
async function createRefTag(comicId: string, tagId: string) {
  await DatabaseBuilder(Tables.ComicBookTag).insert({ comicId, tagId });
}

const ComicTagController = {
  createRefTag,
};

export default ComicTagController;
