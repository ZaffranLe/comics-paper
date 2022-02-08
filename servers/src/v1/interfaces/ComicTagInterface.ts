export interface ComicTagResponseInterface {
  id: string;
  keyword: string;
}

export interface ComicTagsResponseInterface extends Array<ComicTagResponseInterface> {}

export interface ComicTagRequestInterface {
  keyword: string;
}
