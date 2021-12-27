import { Logger } from "./Logger";
import { isDevelopmentMode } from "../Environment";
import * as readline from "readline";
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
/**
 * This is a utility class for database operations.
 * Please note that whether you are in development or production,
 * unless production mode, the implementation will not be able to execute.
 */

export async function cleanupDatabase() {
  if (isDevelopmentMode()) {
    Logger.warn("Starting to clean up database :");
    rl.question("Do you want to continue [Y/n]", (input) => {
      /**
       * Truncate all database.
       */
      if (input.toLowerCase() === "y") {
        Logger.info("Cleaning up database...");
      }
    });
  }
}
