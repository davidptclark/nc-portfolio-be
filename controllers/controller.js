const { fetchVideos } = require("../models/models");
exports.getVideos = (req, res) => {
  fetchVideos().then((videos) => {
    res.status(200).send({ videos });
  });
};
