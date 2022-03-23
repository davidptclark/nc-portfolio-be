const { getVideos } = require("./controllers/video-controllers");
const express = require("express");
const { getUser } = require("./controllers/users-controllers");
const { handleNonPSQLErrors } = require("./controllers/errorControllers");
const { getCommentsByVideoId } = require("./controllers/comments-controllers");
const { customerrors } = require("./errors");

const app = express();

app.use(express.json());
app.get("/api/videos", getVideos);

app.get("/api/users/:username", getUser);

app.get("/api/comments/:video_id", getCommentsByVideoId);

app.use(customerrors);
app.use(handleNonPSQLErrors);
app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
