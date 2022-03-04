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
    viewType: number,
    blocks: Array<any>
): Promise<ComicChapterInterface> {
    // Field check
    if (!name || !comicId || !postedBy) {
        throw new Error("Missing parameters");
    }

    // Comic id and posted by must be uuid
    if (!validator.isUUID(comicId)) {
        throw new Error("Comic id must be a uuid");
    }
    // Check posted user
    if (!validator.isUUID(postedBy)) {
        throw new Error("Posted by must be a uuid");
    }
    const chapterId = uuid();
    const chapter: ComicChapterInterface = {
        id: chapterId,
        name,
        comicId,
        postedBy,
        viewType,
        createdAt: new Date(),
        updatedAt: new Date(),
        length: blocks.length,
    };

    const transaction = await DatabaseBuilder.transaction();
    try {
        await transaction(Tables.ComicChapter).insert(chapter);
        blocks = blocks.map((_block) => ({
            id: uuid(),
            chapterId,
            index: _block.index,
            content: _block.content,
        }));
        await transaction(Tables.ComicChapterBlock).insert(blocks);
        await transaction.commit();
    } catch (e) {
        await transaction.rollback();
        throw e;
    }

    return chapter;
}

async function updateChapter(
    id: string,
    name: string,
    comicId: string,
    postedBy: string,
    viewType: number,
    blocks: Array<any>
): Promise<ComicChapterInterface> {
    // Field check
    if (!name || !comicId || !postedBy) {
        throw new Error("Missing parameters");
    }

    // Comic id and posted by must be uuid
    if (!validator.isUUID(comicId)) {
        throw new Error("Comic id must be a uuid");
    }
    // Check posted user
    if (!validator.isUUID(postedBy)) {
        throw new Error("Posted by must be a uuid");
    }

    const chapter: ComicChapterInterface = {
        name,
        comicId,
        postedBy,
        viewType,
        createdAt: new Date(),
        updatedAt: new Date(),
        length: blocks.length,
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

/**
 *
 * @param comicId a identifier of the comic
 *
 */
async function getChaptersFromComic(
    comicId: string,
    filter?: {
        limit?: number;
        page?: number;
        sortedBy?: string;
        order?: "asc" | "desc";
    }
): Promise<ComicChapterInterface[]> {
    // check parameters
    if (!comicId || !validator.isUUID(comicId)) {
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
async function getChapter(id: string): Promise<ComicChapterInterface> {
    // check parameters
    if (!id || !validator.isUUID(id)) {
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

/**
 * Update chapter length.
 *
 * @param chapterId a identifier of the chapter
 * @param length a block length of this chapter
 */
async function updateChapterLength(chapterId: string, length: number) {
    if (!chapterId || !validator.isUUID(chapterId)) {
        throw new Error("id is required");
    }
    await DatabaseBuilder(Tables.ComicChapter).where({ id: chapterId }).update({ length });
}

const ComicChapterController = {
    createChapter,
    updateChapter,
    getChaptersFromComic,
    getChapter,
    updateChapterLength,
};

export default ComicChapterController;
