const { getVideos } = require("./controllers/controller");
const express = require("express");

const app = express();

app.use(express.json());
app.get("/api/videos", getVideos);

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found" });
});

module.exports = app;
