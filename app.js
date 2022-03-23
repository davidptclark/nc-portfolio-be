const { getVideos, postVideo } = require("./controllers/video-controllers");
const {
  handlePsqlErrors,
  handleCustomErrors,
} = require("./controllers/errorControllers");
const express = require("express");

const app = express();

app.use(express.json());

app.get("/api/videos", getVideos);

app.post("/api/videos", postVideo);

app.use(handlePsqlErrors);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
