const {
  getVideos,
  getVideoById,
  postVideo,
  updateVotesByVideoId,
  deleteVideoById,
} = require("./controllers/video-controllers");
const {
  handlePsqlErrors,
  handleNonPSQLErrors,
  handle500s,
} = require("./controllers/error-controllers");

const express = require("express");
const {
  getUserForSignin,
  patchUser,
  getUser,
  postUser,
} = require("./controllers/users-controllers");

const { getAllTags } = require("./controllers/tags-controllers");

const {
  getCommentsByVideoId,
  postCommentByVideoId,
  deleteCommentByCommentId,
} = require("./controllers/comments-controllers");

const { getEndpoints } = require("./controllers/api-controllers");

const app = express();

app.use(express.json());

app.get("/api", getEndpoints);

//Videos
app.get("/api/videos", getVideos);
app.get("/api/videos/:video_id", getVideoById);
app.delete("/api/videos/:video_id", deleteVideoById);
app.post("/api/videos", postVideo);
app.patch("/api/videos/:video_id", updateVotesByVideoId);

app.post("/api/signin", getUserForSignin);

//Username

app.patch("/api/users/:username", patchUser);
app.get("/api/users/:username", getUser);
app.post("/api/users", postUser);

//Comments
app.get("/api/comments/:video_id", getCommentsByVideoId);
app.post("/api/comments/:video_id", postCommentByVideoId);
app.delete("/api/comments/:comment_id", deleteCommentByCommentId);

app.get("/api/tags", getAllTags);

//Errors

app.use(handleNonPSQLErrors);
app.use(handlePsqlErrors);
app.use(handle500s);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
