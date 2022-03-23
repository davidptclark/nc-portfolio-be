const { fetchVideos, patchVotesByVideoId } = require("../models/video-models");
exports.getVideos = (req, res) => {
  fetchVideos().then((videos) => {
    res.status(200).send({ videos });
  });
};

exports.updateVotesByVideoId = (req, res, next) => {
  const vote = req.body.vote;
  const { video_id } = req.params;

  patchVotesByVideoId({ video_id, vote })
    .then((video) => {
      res.status(200).send(video);
    })
    .catch((err) => {
      next(err);
    });
};
