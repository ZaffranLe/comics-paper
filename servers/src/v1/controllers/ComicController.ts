import { Tables } from "./../Database";
import { ComicInterface } from "../interfaces/ComicInterface";
import DatabaseBuilder from "../utils/DatabaseBuilder";
import slugify from "slugify";

/**
 * Create a new comic into database.
 *
 * @param name a name of a comic
 * @param description a description of a comic
 * @param postedBy a user id who uploaded this comic
 * @returns
 */
async function createComic(
    name: string,
    description: string,
    postedBy: number,
    author: string,
    category: string,
    tags,
    thumbnail?: string
): Promise<ComicInterface> {
    const comic: ComicInterface = {
        name,
        description,
        postedBy,
        thumbnail,
        createdAt: new Date(),
        updatedAt: new Date(),
        slug: slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }),
        likes: 0,
        views: 0,
        author,
        category,
    };
    const transaction = await DatabaseBuilder.transaction();
    try {
        const insertedComic = await transaction(Tables.Comic).insert(comic);
        const insertTags = tags.map((_tag) => ({ comicId: insertedComic[0], tagId: _tag }));
        if (insertTags.length > 0) {
            await transaction(Tables.ComicBookTag).insert(insertTags);
        }
        await transaction.commit();
    } catch (e) {
        await transaction.rollback();
        throw e;
    }
    return comic;
}

async function getAllComics(query): Promise<ComicInterface[]> {
    const { limit, offset, orderBy, orderType, tags, notTags, slug, ...searchFields } = query;
    const fields = {
        id: "t1.id",
        thumbnail: "t2.id",
        thumbnailImg: "t2.fileName",
        name: "t1.name",
        description: "t1.description",
        author: "t1.author",
        likes: "t1.likes",
        views: "t1.views",
        slug: "t1.slug",
        category: "t1.category",
        updatedAt: "t1.updatedAt",
        createdAt: "t1.createdAt",
        postedBy: "t1.postedBy",
        tags: DatabaseBuilder.raw(
            "(SELECT GROUP_CONCAT(t3.tagId SEPARATOR ',') FROM comic_book_tags t3 WHERE t3.comicId = t1.id)"
        ),
    };
    let comics = DatabaseBuilder(`${Tables.Comic} AS t1`)
        .leftJoin(`${Tables.Resource} AS t2`, "t1.thumbnail", "t2.id")
        // .leftJoin(`${Tables.ComicReview} AS t3`, "t1.id", "t3.comicId")
        .columns(fields);
    if (tags) {
        comics = comics.whereRaw(
            "t1.id IN (SELECT comicId FROM comic_book_tags WHERE tagId IN (?))",
            [tags]
        );
    }
    if (notTags) {
        comics = comics.whereRaw(
            "t1.id NOT IN (SELECT comicId FROM comic_book_tags WHERE tagId IN (?))",
            [notTags]
        );
    }
    if (slug) {
        comics = comics.whereRaw("slug LIKE ?", [`%${slug}%`]);
    }
    if (orderBy) {
        comics = comics.orderBy(orderBy, orderType || "ASC");
    }
    if (limit) {
        comics = comics.limit(limit);
    }
    comics = comics.where(searchFields);
    comics = comics.offset(offset || 0);
    return await comics;
}

async function getAllComicTrending(query) {
    const { limit, offset, orderBy, orderType, tags, notTags, slug, ...searchFields } = query;
    let comics = DatabaseBuilder(`${Tables.Comic} AS t1`)
        .leftJoin(`${Tables.Resource} AS t2`, "t1.thumbnail", "t2.id")
        // .leftJoin(`${Tables.ComicReview} AS t3`, "t1.id", "t3.comicId")
        .columns({
            id: "t1.id",
            thumbnail: "t2.id",
            thumbnailImg: "t2.fileName",
            name: "t1.name",
            slug: "t1.slug",
            reviewRating: "t1.likes",
            reviewCount: "t1.views",
        });
    if (tags) {
        comics = comics.whereRaw(
            "t1.id IN (SELECT comicId FROM comic_book_tags WHERE tagId IN (?))",
            [tags]
        );
    }
    if (notTags) {
        comics = comics.whereRaw(
            "t1.id NOT IN (SELECT comicId FROM comic_book_tags WHERE tagId IN (?))",
            [notTags]
        );
    }
    if (slug) {
        comics = comics.whereRaw("slug LIKE ?", [`%${slug}%`]);
    }
    if (orderBy) {
        comics = comics.orderBy(orderBy, orderType || "ASC");
    }
    if (limit) {
        comics = comics.limit(limit);
    }
    comics = comics.where(searchFields);
    comics = comics.offset(offset || 0);
    const result = await comics;
    const promises = [];
    result.forEach((_comic) => {
        promises.push(
            DatabaseBuilder(`${Tables.ComicReview}`)
                .where("comicId", _comic.id)
                .avg("rating as reviewRating")
                .count("rating as reviewCount")
                .first()
        );
    });
    const reviewResps = await Promise.all(promises);
    result.forEach((_comic, _index) => {
        _comic.reviewRating = reviewResps[_index].reviewRating;
        _comic.reviewCount = reviewResps[_index].reviewCount;
    });
    return result;
}

/**
 *  Retrieves a comic by using it id
 * @param id a comic id
 * @returns the comic.
 *
 */
async function getComic(id: string): Promise<ComicInterface> {
    // check parameters
    if (!id) {
        throw new Error("id is required");
    }
    // Retrieve comic
    const comic = await DatabaseBuilder(Tables.Comic).where({ id }).first();
    const thumbnailInfo = await DatabaseBuilder(Tables.Resource)
        .where({ id: comic.thumbnail })
        .first();
    const tags = await DatabaseBuilder(`${Tables.ComicBookTag} AS t1`)
        .join(`${Tables.ComicTag} AS t2`, "t1.tagId", "t2.id")
        .where({ "t1.comicId": id })
        .columns({ id: "t1.tagId", keyword: "t2.keyword" });
    return { ...comic, thumbnailImg: thumbnailInfo.fileName, tags };
}

/**
 * Update a new comic by it id.
 *
 * @param id a comic id
 * @param name a name of a comic
 * @param description a description of comic
 */
async function updateComic(
    id: number,
    name: string,
    description: string,
    author: string,
    category: string,
    tags,
    thumbnail?: string
) {
    // check parameters
    if (!id) {
        throw new Error("id is required");
    }
    const transaction = await DatabaseBuilder.transaction();
    try {
        await transaction(Tables.Comic)
            .where({ id })
            .update({
                name,
                description,
                updatedAt: new Date(),
                slug: slugify(name, { lower: true, remove: /[*+~.()'"!:@]/g }),
                author,
                category,
                thumbnail,
            });
        await transaction(Tables.ComicBookTag).del().where({ comicId: id });
        const insertTags = tags.map((_tag) => ({ comicId: id, tagId: _tag }));
        await transaction(Tables.ComicBookTag).insert(insertTags);
        await transaction.commit();
    } catch (e) {
        await transaction.rollback();
        throw e;
    }
    // Retrieve comic
}

/**
 * Remove a comic by its id.
 * @param id a comic id to delete
 */
async function deleteComic(id: number) {
    // check parameters
    if (!id) {
        throw new Error("id is required");
    }
    const transaction = await DatabaseBuilder.transaction();
    try {
        await transaction(Tables.ComicBookTag).where({ comicId: id }).del();
        const comicChapters = await DatabaseBuilder(Tables.ComicChapter)
            .where({ comicId: id })
            .columns(["id"]);
        const chapterIdList = comicChapters.map((chapter) => chapter.id);
        await transaction(Tables.ComicChapterBlock).whereIn("chapterId", chapterIdList).del();
        await transaction(Tables.ComicChapter).where({ comicId: id }).del();
        await transaction(Tables.Comic).where({ id }).del();
        await transaction.commit();
    } catch (e) {
        await transaction.rollback();
        throw e;
    }
}

/**
 * Increase the number of views of a comic by 1.
 * @param id identify of the comic
 */
async function updateViewComic(id: number) {
    // check parameters
    if (!id) {
        throw new Error("id is required");
    }
    // Retrieve comic
    await DatabaseBuilder(Tables.Comic)
        .where({ id })
        .update({
            views: DatabaseBuilder.raw("views + 1"),
        });
}

/**
 * Check the comic existence.
 * @param id a comic id
 * @returns true if the comic exists, false otherwise.
 */
async function hasComic(id: number) {
    // check parameters
    if (!id) {
        throw new Error("id is required");
    }
    // Retrieve comic
    const comic = await DatabaseBuilder(Tables.Comic).where({ id }).first();
    return !!comic;
}

/**
 * Search a comic
 */
async function searchComic(query) {
    let { slug, id } = query;

    // Empty the slug unless is filled
    if (slug === undefined) {
        slug = "";
    }

    // Empty the id unless is filled
    if (id === undefined) {
        id = "";
    }
    console.log(slug, id);
    const comic = await DatabaseBuilder(Tables.Comic).where({ slug }).orWhere({ id }).first();
    // console.log(comic);
    return comic;
}

async function getComicByUser(id) {
    const comics = await DatabaseBuilder(Tables.Comic)
        .where({ author: id })
        .orderBy("createdAt", "DESC");
    return comics;
}

const ComicController = {
    createComic,
    getAllComics,
    getAllComicTrending,
    getComic,
    updateComic,
    deleteComic,
    updateViewComic,
    hasComic,
    searchComic,
    getComicByUser,
};
export default ComicController;
