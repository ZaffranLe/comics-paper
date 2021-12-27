import * as express from "express";
import { PermissionRouter } from "./routes/PermissionRouter";

/**
 * Class for all available routers
 */
export const Router = [
  {
    Path: "/permissions",
    Router: PermissionRouter,
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
