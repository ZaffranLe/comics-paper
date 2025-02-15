import ComicPaperV1 from "./v1/ComicPaperV1";
const express = require("express");
const app = express();

app.use("/v1", ComicPaperV1);

app.use("/public", express.static(process.env.UPLOAD_DIR));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.group("ComicPaper initialization:");
    console.log(`Node version ${process.version}`);
    console.log(`Node environment ${process.env.NODE_ENV}`);
    console.log(`Server listening on port ${PORT}`);
    console.groupEnd();
});
