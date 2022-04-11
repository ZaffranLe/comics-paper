import { ComicChapterBlockInterface } from "./../interfaces/ComicChapterBlockInterface";
import { Tables } from "./../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";

async function createChapterBlock(
    chapterId: number,
    index: number,
    content: string
): Promise<ComicChapterBlockInterface> {
    const chapterBlock: ComicChapterBlockInterface = {
        chapterId,
        index,
        content,
    };

    await DatabaseBuilder(Tables.ComicChapterBlock).insert(chapterBlock);
    return chapterBlock;
}

async function createChapterBlocks(
    chapterId: number,
    blocks
): Promise<ComicChapterBlockInterface[]> {
    const chapterBlocks: ComicChapterBlockInterface[] = blocks.map((_block) => ({
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
