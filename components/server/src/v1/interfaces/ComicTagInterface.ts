export interface ComicTagResponseInterface {
  id: number;
  keyword: string;
}

export interface ComicTagsResponseInterface
  extends Array<ComicTagResponseInterface> {}

export interface ComicTagRequestInterface {
  keyword: string;
}
