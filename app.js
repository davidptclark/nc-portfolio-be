const { getVideos } = require("./controllers/video-controllers");
const express = require("express");
const { getUser } = require("./controllers/users-controllers");

const app = express();

app.use(express.json());
app.get("/api/videos", getVideos);

app.get("/api/users/:username", getUser);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
