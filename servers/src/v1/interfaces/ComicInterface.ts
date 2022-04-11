/**
 * Represents a comic.
 */
export interface ComicInterface {
  id?: number;
  name: string;
  description: string;
  postedBy: number;
  createdAt: Date;
  updatedAt: Date;
  thumbnail?: string;
  slug: string;
  likes: number;
  views: number;
  author: string;
  category: string;
  reviewCount?: number;
  reviewRating?: number;
}

/**
 * Represents a comic request object.
 */
export interface ComicRequestInterface {
  id?: number;
  name?: string;
  postedBy?: number;
}
