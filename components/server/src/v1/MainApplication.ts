import * as express from "express";
import { setupDatabase } from "./Database";
import { setupRoutes } from "./Router";
import {
  setupDefaultPermissionRelationship,
  setupPermission,
  setupPermissionGroup,
} from "./Permission";

async function init(app: express.Application) {
  console.log("v1: Initializing application...");

  // Set up database
  await setupDatabase();
  // Setup permission groups
  await setupPermissionGroup();
  // Setup permission
  await setupPermission();
  // Setup relationship between permission groups and permissions
  await setupDefaultPermissionRelationship();
  // Register routers
  await setupRoutes(app);
}

export const MainApplication = {
  init,
};
