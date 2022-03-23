const {
  getVideos,
  updateVotesByVideoId,
} = require("./controllers/video-controllers");
const express = require("express");
const { getUser } = require("./controllers/users-controllers");
const { handleNonPSQLErrors } = require("./controllers/errorControllers");
const { getCommentsByVideoId } = require("./controllers/comments-controllers");

const app = express();

app.use(express.json());
app.get("/api/videos", getVideos);

app.get("/api/users/:username", getUser);

app.get("/api/comments/:video_id", getCommentsByVideoId);

app.patch("/api/videos/:video_id", updateVotesByVideoId);

app.use(handleNonPSQLErrors);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
