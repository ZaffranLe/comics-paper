import * as chalk from "chalk";
import { MainApplication } from "./MainApplication";
import * as express from "express";
import * as bodyParser from "body-parser";
import * as morgan from "morgan";
import { readFileSync } from "fs";
import { ErrorHandler } from "./middlewares/ErrorHandler";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

// morgan
app.use(morgan("dev"));

MainApplication.init(app)
  .then(() => {
    console.log(chalk.green(`Application successfully initialized.`));
    // error handling
    app.use(ErrorHandler);
  })
  .catch(console.error);

// Set up a not found page
// app.use(express.static(__dirname + "/static"));
// app.use(
//   (
//     _req: express.Request,
//     res: express.Response,
//     _next: express.NextFunction
//   ) => {
//     res
//       .status(404)
//       .send(readFileSync(__dirname + "/static/NotFound.html", "utf8"));
//   }
// );

const ComicPaperV1: express.Application = app;
export default ComicPaperV1;
