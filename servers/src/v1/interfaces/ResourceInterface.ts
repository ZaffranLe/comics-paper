import { UserResponseInterface } from "./UserInterface";

/**
 * Represents resources prototype.
 */
export interface ResourceInterface {
  id: string;
  name: string;
  path: string;
  size: number;
  uploadedAt: Date;
  uploader: string;
}
