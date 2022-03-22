const { fetchVideos } = require("../models/video-models");
exports.getVideos = (req, res) => {
  fetchVideos().then((videos) => {
    res.status(200).send({ videos });
  });
};
