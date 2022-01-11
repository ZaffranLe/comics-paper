import { ComicChapterBlockInterface } from "./../interfaces/ComicChapterBlockInterface";
import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";
import { v4 as uuid } from "uuid";

async function createChapterBlock(
  chapterId: string,
  index: number,
  content: string
): Promise<ComicChapterBlockInterface> {
  const chapterBlock: ComicChapterBlockInterface = {
    id: uuid(),
    chapterId,
    index,
    content,
  };

  await DatabaseBuilder(Tables.ComicChapterBlock).insert(chapterBlock);
  return chapterBlock;
}

const ComicChapterBlockController = {
  createChapterBlock
};

export default ComicChapterBlockController;
