/**
 * Each content in the chapters will be separated
 *  by an object called block, this
 *  block linked by using block index.
 *
 * Example:
 * blocks(index: 1) -> blocks(index: 2) -> blocks(index: 3) -> ...
 *
 * So that we can render each block at the time by it
 * index and the chapter id.
 *
 * The content of the block will be a resource id if the chapter viewType is image.
 * Otherwise, the content will be a RAW HTML.
 */
export interface ComicChapterBlockInterface {
  id: string;
  chapterId: string;
  index: number;
  content: string;
}
