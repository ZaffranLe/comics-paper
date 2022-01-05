export class MiddlewareError extends Error {
  /**
   * A status code indicating the error occurred
   */
  status: number;

  constructor(message: string, status: number | 500) {
    super(message);
    this.status = status;
  }

  /**
   * Retrieves a status code indicating the error occurred
   * @returns a status code indicating the error occurred
   */
  getStatus(): number {
    return this.status;
  }
}
