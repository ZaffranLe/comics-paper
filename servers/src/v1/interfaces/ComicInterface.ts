/**
 * Represents a comic.
 */
export interface ComicInterface {
  id: string;
  name: string;
  description: string;
  postedBy: string;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  slug: string;
  likes: number;
  views: number;
  author: string;
  category: string;
}

/**
 * Represents a comic request object.
 */
export interface ComicRequestInterface {
  id?: string;
  name?: string;
  postedBy?: string;
}
