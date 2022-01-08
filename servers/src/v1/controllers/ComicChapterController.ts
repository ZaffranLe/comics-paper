import { Tables } from "./../Database";
import { ComicChapterInterface } from "./../interfaces/ComicChapterInterface";
import { ComicChapterViewTypeEnum } from "../interfaces/ComicChapterInterface";
import validator from "validator";
import { v4 as uuid } from "uuid";
import DatabaseBuilder from "../utils/DatabaseBuilder";

/**
 * Create new comic chapter.
 *
 * @param id a identifier of the chapter
 * @param name a name of the chapter
 * @param comicId a identifier of the comic
 * @param postedBy a user who posted the chapter
 * @param viewType a type of the chapter
 * @returns an interface after created
 */
async function createChapter(
  name: string,
  comicId: string,
  postedBy: string,
  viewType: ComicChapterViewTypeEnum
): Promise<ComicChapterInterface> {
  // Field check
  if (!name || !comicId || !postedBy || !viewType) {
    throw new Error("Missing parameters");
  }

  // Comic id and posted by must be uuid
  if (!validator.isUUID(comicId)) {
    throw new Error("Comic id must be a uuid");
  }
  if (!validator.isUUID(postedBy)) {
    throw new Error("Posted by must be a uuid");
  }

  const chapter: ComicChapterInterface = {
    id: uuid(),
    name,
    comicId,
    postedBy,
    viewType,
    createdAt: new Date(),
    updatedAt: new Date(),
    length: 0, // always 0
  };

  await DatabaseBuilder(Tables.ComicChapter).insert(chapter);
  return chapter;
}

const ComicChapterController = {
  createChapter,
};

export default ComicChapterController;
