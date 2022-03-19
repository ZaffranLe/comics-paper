import { Tables } from "./../Database";
import { ComicChapterInterface } from "./../interfaces/ComicChapterInterface";
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
    comicId: number,
    postedBy: number,
    viewType: number,
    blocks: Array<any>,
    chapterNumber: string
): Promise<ComicChapterInterface> {
    // Field check
    if (!name || !comicId || !postedBy) {
        throw new Error("Missing parameters");
    }

    const chapter: ComicChapterInterface = {
        name,
        comicId,
        postedBy,
        viewType,
        createdAt: new Date(),
        updatedAt: new Date(),
        length: blocks.length,
        chapterNumber,
    };

    const transaction = await DatabaseBuilder.transaction();
    try {
        const insertedChapter = await transaction(Tables.ComicChapter).insert(chapter);
        blocks = blocks.map((_block) => ({
            chapterId: insertedChapter[0],
            index: _block.index,
            content: _block.content,
        }));
        await transaction(Tables.ComicChapterBlock).insert(blocks);
        await transaction(Tables.Comic).update({ updatedAt: new Date() }).where({ id: comicId });
        await transaction.commit();
    } catch (e) {
        await transaction.rollback();
        throw e;
    }

    return chapter;
}

async function updateChapter(
    id: number,
    name: string,
    comicId: number,
    postedBy: number,
    viewType: number,
    blocks: Array<any>,
    chapterNumber: string
): Promise<ComicChapterInterface> {
    // Field check
    if (!name || !comicId || !postedBy) {
        throw new Error("Missing parameters");
    }

    const chapter: ComicChapterInterface = {
        name,
        comicId,
        postedBy,
        viewType,
        createdAt: new Date(),
        updatedAt: new Date(),
        length: blocks.length,
        chapterNumber,
    };

    const transaction = await DatabaseBuilder.transaction();
    try {
        await transaction(Tables.ComicChapter).update(chapter).where({ id });
        blocks = blocks.map((_block) => ({
            id: _block.id,
            chapterId: id,
            index: _block.index,
            content: _block.content,
        }));
        await transaction(Tables.ComicChapterBlock).del().where({ chapterId: id });
        await transaction(Tables.ComicChapterBlock).insert(blocks);
        await transaction.commit();
    } catch (e) {
        await transaction.rollback();
        throw e;
    }

    return chapter;
}

async function deleteChapter(chapterId: number) {
    const transaction = await DatabaseBuilder.transaction();
    try {
        await transaction(Tables.ComicChapterBlock).del().where({ chapterId });
        await transaction(Tables.ComicChapter).del().where({ id: chapterId });
        await transaction.commit();
    } catch (e) {
        await transaction.rollback();
        throw e;
    }
}

/**
 *
 * @param comicId a identifier of the comic
 *
 */
async function getChaptersFromComic(
    comicId: number,
    filter?: {
        limit?: number;
        page?: number;
        sortedBy?: string;
        order?: "asc" | "desc";
    }
): Promise<ComicChapterInterface[]> {
    // check parameters
    if (!comicId) {
        throw new Error("id is required");
    }
    // Retrieve comic
    const chapter = await DatabaseBuilder(Tables.ComicChapter)
        .where({ comicId })
        // .limit(filter?.limit || null)
        // .offset(filter?.page * filter?.limit || 0)
        .orderBy(filter?.sortedBy || "createdAt", filter?.order || "desc");

    return chapter;
}

/**
 * Retrieves the chapter.
 *
 * @param id a identifier of the chapter
 * @returns  the first chapter that having the id
 */
async function getChapter(id: number): Promise<ComicChapterInterface> {
    // check parameters
    if (!id) {
        throw new Error("id is required");
    }
    // Retrieve comic
    const chapter = await DatabaseBuilder(Tables.ComicChapter).where({ id }).first();
    const blocks = await DatabaseBuilder(Tables.ComicChapterBlock)
        .where({ chapterId: id })
        .orderBy("index", "asc");
    chapter.blocks = blocks;
    return chapter;
}

async function getNewestChapters(): Promise<any[]> {
    const fields = {
        chapterId: "t1.id",
        comicId: "t1.comicId",
        createdAt: "t1.createdAt",
        chapterName: "t1.name",
        comicName: "t2.name",
        comicCategory: "t2.category",
        comicSlug: "t2.slug",
        chapterNumber: "t1.chapterNumber",
    };
    const chapters = await DatabaseBuilder(`${Tables.ComicChapter} as t1`)
        .join(`${Tables.Comic} AS t2`, "t1.comicId", "t2.id")
        .columns(fields)
        .orderBy("t1.createdAt", "desc")
        .limit(10);
    return chapters;
}

/**
 * Update chapter length.
 *
 * @param chapterId a identifier of the chapter
 * @param length a block length of this chapter
 */
async function updateChapterLength(chapterId: number, length: number) {
    if (!chapterId) {
        throw new Error("id is required");
    }
    await DatabaseBuilder(Tables.ComicChapter).where({ id: chapterId }).update({ length });
}

const ComicChapterController = {
    createChapter,
    updateChapter,
    deleteChapter,
    getChaptersFromComic,
    getChapter,
    updateChapterLength,
    getNewestChapters,
};

export default ComicChapterController;
