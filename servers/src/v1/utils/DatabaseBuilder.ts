import knex, { Knex } from "knex";
import { getCurrentConfiguration } from "../Configuration";
import { Logger } from "./Logger";

/**
 * Database builder structure to retrieve database queries.
 *
 */
console.log(getCurrentConfiguration().Database);

const DatabaseBuilder = knex({
  client: "mysql2",
  connection: {
    host: getCurrentConfiguration().Database.Host || "localhost",
    port: parseInt(getCurrentConfiguration().Database.Port || "3306"),
    user: getCurrentConfiguration().Database.Username || "root",
    password: getCurrentConfiguration().Database.Password || "",
    database: getCurrentConfiguration().Database.Database || "",
  },
  debug: getCurrentConfiguration().Database.EnableLogging || false,
});
export default DatabaseBuilder;

export async function createTable(
  tableName: string,
  callback: (table: Knex.CreateTableBuilder) => void
) {
  if (await DatabaseBuilder.schema.hasTable(tableName)) {
    Logger.warn(`Table ${tableName} already exists.`);
    return;
  }
  return DatabaseBuilder.schema.createTable(tableName, callback);
}
