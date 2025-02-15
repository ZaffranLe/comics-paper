import { Tables } from '../Database';
import DatabaseBuilder from '../utils/DatabaseBuilder';

async function createComment(
  comicChapterId: number,
  authorId: number,
  content: string,
) {
  const comment = {
    comicChapterId,
    authorId,
    content,
  };
  const result = await DatabaseBuilder(Tables.ComicComment).insert(comment);
  const commentId = result[0];
  return await getComment(commentId);
}

async function updateComment(commentId: number, content: string) {
  return await DatabaseBuilder(Tables.ComicComment)
    .where({ id: commentId })
    .update({ content, id: commentId });
}

async function getComment(commentId: number) {
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
      `${Tables.User}.nickname as authorNickname`,
    )
    .where(`${Tables.ComicComment}.id`, commentId)
    .first()
    .join(
      Tables.ComicChapter,
      `${Tables.ComicComment}.comicChapterId`,
      `${Tables.ComicChapter}.id`,
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
      { chapterViewType: `${Tables.ComicChapter}.viewType` },
    )
    .join(
      Tables.ComicChapter,
      `${Tables.ComicComment}.comicChapterId`,
      `${Tables.ComicChapter}.id`,
    )
    .join(Tables.User, `${Tables.ComicComment}.authorId`, `${Tables.User}.id`)
    .orderBy(`${Tables.ComicComment}.createdAt`, 'desc');

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

async function getCommentByUserId(userId) {
  const responses: any[] = await DatabaseBuilder(Tables.ComicComment)
    .where({ authorId: userId })
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
      { chapterViewType: `${Tables.ComicChapter}.viewType` },
      { comicId: `${Tables.ComicChapter}.comicId` },
      { comicName: `${Tables.Comic}.name` },
      { comicSlug: `${Tables.Comic}.slug` },
    )
    .join(
      Tables.ComicChapter,
      `${Tables.ComicComment}.comicChapterId`,
      `${Tables.ComicChapter}.id`,
    )
    .join(Tables.User, `${Tables.ComicComment}.authorId`, `${Tables.User}.id`)
    .join(Tables.Comic, `${Tables.ComicChapter}.comicId`, `${Tables.Comic}.id`)
    .orderBy(`${Tables.ComicComment}.createdAt`, 'desc');

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
        comic: {
          id: response.comicId,
          name: response.comicName,
          slug: response.comicSlug,
        },
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

const ComicCommentController = {
  createComment,
  updateComment,
  getCommentByChapterId,
  getComment,
  deleteComment,
  getCommentByUserId,
};
export default ComicCommentController;
