import { cleanUpDatabase, setupDatabase, Tables } from "./../../v1/Database";
import ComicPaperV1 from "../../v1/ComicPaperV1";
import { MainApplication } from "../../v1/MainApplication";
import chalk = require("chalk");
import {
  setupDefaultPermissionRelationship,
  setupPermission,
  setupPermissionGroup,
} from "../../v1/Permission";

export async function mochaGlobalSetup() {
  // print environment
  console.log(chalk.blue("Environment: ") + process.env.NODE_ENV);
  // print node version
  console.log(chalk.blue("Node version: ") + process.version);
  console.log(`${chalk.green("[mocha]")} Setting up database...`);

  // Set up database
  await setupDatabase();
  // Setup permission groups
  await setupPermissionGroup();
  // Setup permission
  await setupPermission();
  // Setup relationship between permission groups and permissions
  await setupDefaultPermissionRelationship();
}

export async function mochaGlobalTeardown() {
  console.log(`${chalk.yellow(`Tearing down database...`)}`);
  // Clean up the database
  await cleanUpDatabase();
}
