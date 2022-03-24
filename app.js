const {
  getVideos,
  getVideoById,
  postVideo,
} = require("./controllers/video-controllers");
const {
  handlePsqlErrors,
  handleNonPSQLErrors,
} = require("./controllers/errorControllers");

const express = require("express");
const { getUser } = require("./controllers/users-controllers");

const { getCommentsByVideoId } = require("./controllers/comments-controllers");

const app = express();

app.use(express.json());

app.get("/api/videos", getVideos);
app.get("/api/videos/:video_id", getVideoById);

app.post("/api/users/:username", getUser);

app.post("/api/videos", postVideo);

app.get("/api/comments/:video_id", getCommentsByVideoId);

app.use(handleNonPSQLErrors);
app.use(handlePsqlErrors);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
