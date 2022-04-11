import * as express from "express";
import ComicRouter from "./routes/ComicRouter";
import CommentRouter from "./routes/CommentRouter";
import { PermissionRouter } from "./routes/PermissionRouter";
import ResourceRouter from "./routes/ResourceRouter";
import ReviewRouter from "./routes/ReviewRouter";
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
  {
    Path: "/comics",
    Router: ComicRouter,
  },
  { Path: "/comments", Router: CommentRouter },
  { Path: "/reviews", Router: ReviewRouter },
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
