import * as chalk from "chalk";
import { MainApplication } from "./MainApplication";

import * as express from "express";
import * as bodyParser from "body-parser";

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());

MainApplication.init(app)
  .then(() => {
    console.log(chalk.green(`Application successfully initialized.`));
  })
  .catch(console.error);

const ComicPaperV1 = app;
export default ComicPaperV1;
