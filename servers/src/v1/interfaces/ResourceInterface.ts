/**
 * Represents resources prototype.
 */
export interface ResourceInterface {
  id: string;
  originalName: string;
  fileName: string;
  path: string;
  size: number;
  uploadedAt: Date;
  uploader: string;
}
