import {
  setupDefaultPermissionRelationship,
  setupPermission,
  setupPermissionGroup,
} from "./Permission";
import * as express from "express";
import * as bodyParser from "body-parser";
import { setupDatabase } from "./Database";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

async function main() {
  console.log("Loading version 1.0");

  // Set up database
  await setupDatabase();
  // Setup permission groups
  await setupPermissionGroup();
  // Setup permission
  await setupPermission();
  // Setup relationship between permission groups and permissions
  await setupDefaultPermissionRelationship();
}
main().catch(console.error);

const ComicPaperV1 = app;
export default ComicPaperV1;
