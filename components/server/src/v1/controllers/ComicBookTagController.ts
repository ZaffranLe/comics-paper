import { Tables } from '../Database';
import DatabaseBuilder from '../utils/DatabaseBuilder';

/**
 * Creates tag reference objects.
 *
 * @param comicId a comic tag identifier to create reference
 * @param tagId a tag identifier to create reference
 */
async function createRefTag(comicId: number, tagId: number) {
  await DatabaseBuilder(Tables.ComicBookTag).insert({ comicId, tagId });
}

/**
 * Checks whether exists this reference between comic and tag.
 *
 * @param comicId a comic identifier to check reference
 * @param tagId a tag identifier to check reference
 * @returns true whether the reference exists in the database, false otherwise.
 */
async function hasRef(comicId: number, tagId: number) {
  const result = await DatabaseBuilder(Tables.ComicBookTag)
    .where({ comicId, tagId })
    .select();
  console.log(result);

  return result.length > 0;
}

/**
 * Retrieves a list of all references between comic and tag.
 * @param comicId a comic identifier to
 * @returns a list of tags associated with this comic
 */
async function getRefsByComicId(comicId: number) {
  return await DatabaseBuilder()
    .from({ cbt: Tables.ComicBookTag })
    .where({ comicId })
    .select({ keyword: 'ct.keyword', id: 'ct.id' })
    .innerJoin({ ct: Tables.ComicTag }, 'ct.id', 'cbt.tagId');
}

/**
 * Deletes a reference between comic and tag.
 * @param comicId a comic identifier to delete reference
 * @param tagId a tag identifier to delete reference
 */
async function deleteRef(comicId: number, tagId: number) {
  await DatabaseBuilder(Tables.ComicBookTag).where({ comicId, tagId }).delete();
}

const ComicBookTagController = {
  createRefTag,
  hasRef,
  getRefsByComicId,
  deleteRef,
};

export default ComicBookTagController;
