import { Tables } from "../Database";
import DatabaseBuilder from "../utils/DatabaseBuilder";
import { v4 as uuid } from "uuid";

async function createComment(
  comicChapterId: string,
  authorId: string,
  content: string
) {
  const comment = {
    id: uuid(), // Generate with random uuid
    comicChapterId,
    authorId,
    content,
  };
  await DatabaseBuilder(Tables.ComicComment).insert(comment);
  return comment;
}

async function updateComment(commentId: string, content: string) {
  return await DatabaseBuilder(Tables.ComicComment)
    .where({ id: commentId })
    .update({ content, id: commentId });
}

async function getComment(commentId: string) {
  const response = await DatabaseBuilder(Tables.ComicComment)
    .column(
      `${Tables.ComicComment}.id`,
      `${Tables.ComicComment}.content`,
      `${Tables.ComicComment}.createdAt`,
      `${Tables.ComicComment}.authorId`,
      `${Tables.ComicChapter}.id as chapterId`,
      `${Tables.ComicChapter}.name as chapterName`,
      `${Tables.ComicChapter}.comicId as chapterComicId`,
      `${Tables.ComicChapter}.viewType as chapterViewType`,
      `${Tables.User}.id as authorId`,
      `${Tables.User}.username as authorUsername`,
      `${Tables.User}.nickname as authorNickname`
    )
    .where(`${Tables.ComicComment}.id`, commentId)
    .first()
    .join(
      Tables.ComicChapter,
      `${Tables.ComicComment}.comicChapterId`,
      `${Tables.ComicChapter}.id`
    )
    .join(Tables.User, `${Tables.ComicComment}.authorId`, `${Tables.User}.id`);

  return {
    id: response.id,
    content: response.content,
    createdAt: response.createdAt,
    chapter: {
      id: response.chapterId,
      name: response.chapterName,
      comicId: response.chapterComicId,

      viewType: response.chapterViewType,
    },
    author: {
      id: response.authorId,
      username: response.authorUsername,
      nickname: response.authorNickname,
    },
  };
}

async function getCommentByChapterId(chapterId: string) {
  const responses: any[] = await DatabaseBuilder(Tables.ComicComment)
    .where({ comicChapterId: chapterId })
    .column(
      { commentId: `${Tables.ComicComment}.id` },
      { content: `${Tables.ComicComment}.content` },
      { createdAt: `${Tables.ComicComment}.createdAt` },
      { authorId: `${Tables.ComicComment}.authorId` },
      { authorName: `${Tables.User}.username` },
      { authorNickname: `${Tables.User}.nickname` },
      { authorEmail: `${Tables.User}.email` },
      { chapterName: `${Tables.ComicChapter}.name` },
      { chapterId: `${Tables.ComicChapter}.id` },
      { chapterCreatedAt: `${Tables.ComicChapter}.createdAt` },
      { chapterUpdatedAt: `${Tables.ComicChapter}.updatedAt` },
      { chapterPostedBy: `${Tables.ComicChapter}.postedBy` },
      { chapterViewType: `${Tables.ComicChapter}.viewType` }
    )
    .join(
      Tables.ComicChapter,
      `${Tables.ComicComment}.comicChapterId`,
      `${Tables.ComicChapter}.id`
    )
    .join(Tables.User, `${Tables.ComicComment}.authorId`, `${Tables.User}.id`);
  // .orderBy("${Table.}createdAt", "desc");

  return responses.map((response) => {
    return {
      id: response.commentId,
      content: response.content,
      createdAt: response.createdAt,
      chapter: {
        id: response.chapterId,
        name: response.chapterName,
        createdAt: response.chapterCreatedAt,
        updatedAt: response.chapterUpdatedAt,
        postedBy: response.chapterPostedBy,
        viewType: response.chapterViewType,
      },
      author: {
        id: response.authorId,
        username: response.authorName,
        nickname: response.authorNickname,
        email: response.authorEmail,
      },
    };
  });
}

async function deleteComment(commentId: string) {
  return await DatabaseBuilder(Tables.ComicComment)
    .where({ id: commentId })
    .del();
}

const ComicCommentController = {
  createComment,
  updateComment,
  getCommentByChapterId,
  getComment,
  deleteComment,
};
export default ComicCommentController;
