/**
 * Chapter content can be view as image or text, so this
 * enum is generated to support that type easier.
 */
export enum ComicChapterViewTypeEnum {
  COMIC_CHAPTER_VIEW_TYPE_IMAGE = 1,
  COMIC_CHAPTER_VIEW_TYPE_TEXT,
}

/**
 * Comic chapter interface
 */
export interface ComicChapterInterface {
  id?: number;
  name: string;
  comicId: number;
  viewType: ComicChapterViewTypeEnum;
  postedBy: number;
  createdAt: Date;
  updatedAt: Date;
  length?: number;
}
