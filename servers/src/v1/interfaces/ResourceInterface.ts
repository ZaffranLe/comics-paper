/**
 * Represents resources prototype.
 */
export interface ResourceInterface {
  id: number;
  originalName: string;
  fileName: string;
  path: string;
  size: number;
  uploadedAt: Date;
  uploader: number;
}
