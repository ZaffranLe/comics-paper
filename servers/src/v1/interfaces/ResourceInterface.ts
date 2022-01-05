import { UserResponseInterface } from "./UserInterface";

/**
 * Represents resources prototype.
 */
export interface ResourceInterface {
  id: number;
  name: string;
  path: string;
  size: number;
  updatedAt: Date;
  uploader: UserResponseInterface;
}
