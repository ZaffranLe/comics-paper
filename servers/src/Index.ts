import * as express from "express";
import { readFileSync } from "fs";
const app = express();
import ComicPaperV1 from "./v1/ComicPaperV1";

app.use("/v1", ComicPaperV1);

// Set up a not found page
app.use(express.static(__dirname + "/static"));
app.use(
  (
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    res
      .status(404)
      .send(readFileSync(__dirname + "/static/NotFound.html", "utf8"));
  }
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.group("ComicPaper initialization:");
  console.log(`Node version ${process.version}`);
  console.log(`Node environment ${process.env.NODE_ENV}`);
  console.log(`Server listening on port ${PORT}`);
  console.groupEnd();
});
