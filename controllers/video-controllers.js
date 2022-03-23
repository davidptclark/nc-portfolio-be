
const { fetchVideos, fetchVideoById, addVideo, patchVotesByVideoId } = require("../models/video-models");


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


exports.getVideoById = (req, res, next) => {
  const {video_id} = req.params;

  fetchVideoById(video_id)
  .then((video) => {
    res.status(200).send({video})
  }).catch(next)
}

exports.postVideo = (req, res, next) => {
  const { title, username, description, cloudinary_id } = req.body;
  addVideo(title, username, description, cloudinary_id)
    .then((body) => {
      res.status(201).send({ postedVideo: body[0] });

    })
    .catch((err) => {
      next(err);
    });
};
