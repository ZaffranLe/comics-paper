import * as express from "express";
import { PermissionRouter } from "./routes/PermissionRouter";
import ResourceRouter from "./routes/ResourceRouter";
import UserRouter from "./routes/UserRouter";

/**
 * Class for all available routers
 */
export const Router = [
  {
    Path: "/permissions",
    Router: PermissionRouter,
  },
  {
    Path: "/users",
    Router: UserRouter,
  },
  {
    Path: "/resources",
    Router: ResourceRouter,
  },
];

export async function setupRoutes(app: express.Application) {
  for (const key in Router) {
    if (Router.hasOwnProperty(key)) {
      const element = Router[key];
      console.log(`Setting up ${element.Path}`);
      app.use(element.Path, element.Router);
    }
  }
}
