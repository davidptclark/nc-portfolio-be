const { fetchVideos, fetchVideoById } = require("../models/video-models");
exports.getVideos = (req, res) => {
  fetchVideos().then((videos) => {
    res.status(200).send({ videos });
  });
};

exports.getVideoById = (req, res, next) => {
  const {video_id} = req.params;

  fetchVideoById(video_id)
  .then((video) => {
    res.status(200).send({video})
  }).catch(next)
}
