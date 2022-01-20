import chalk from "chalk";
import { MainApplication } from "./MainApplication";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import { ErrorHandler } from "./middlewares/ErrorHandler";
import cors from "cors"
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(cors())

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
