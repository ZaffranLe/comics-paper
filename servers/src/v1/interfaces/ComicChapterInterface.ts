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
  id?: string;
  name: string;
  comicId: string;
  viewType: ComicChapterViewTypeEnum;
  postedBy: string;
  createdAt: Date;
  updatedAt: Date;
  length?: number;
}
