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

async function createChapterBlocks(
    chapterId: string,
    blocks
): Promise<ComicChapterBlockInterface[]> {
    const chapterBlocks: ComicChapterBlockInterface[] = blocks.map((_block) => ({
        id: uuid(),
        chapterId,
        index: _block.index,
        content: _block.content,
    }));

    await DatabaseBuilder(Tables.ComicChapterBlock).insert(chapterBlocks);
    return chapterBlocks;
}

const ComicChapterBlockController = {
    createChapterBlock,
    createChapterBlocks,
};

export default ComicChapterBlockController;
