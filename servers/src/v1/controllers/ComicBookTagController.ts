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

/**
 * Checks whether exists this reference between comic and tag.
 *
 * @param comicId a comic identifier to check reference
 * @param tagId a tag identifier to check reference
 * @returns true whether the reference exists in the database, false otherwise.
 */
async function hasRef(comicId: string, tagId: string) {
  const result = await DatabaseBuilder(Tables.ComicBookTag)
    .where({ comicId, tagId })
    .select();
  console.log(result);

  return result.length > 0;
}

async function getRefsByComicId(comicId: string) {
  return await DatabaseBuilder()
    .from({ cbt: Tables.ComicBookTag })
    .where({ comicId })
    .select({ keyword: "ct.keyword", id: "ct.id" })
    .innerJoin({ ct: Tables.ComicTag }, "ct.id", "cbt.tagId");
}

const ComicBookTagController = {
  createRefTag,
  hasRef,
  getRefsByComicId,
};

export default ComicBookTagController;
