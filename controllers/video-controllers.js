
const { fetchVideos, fetchVideoById, addVideo } = require("../models/video-models");

exports.getVideos = (req, res) => {
  const sort_by = req.query.sort_by;

  fetchVideos(sort_by)
    .then((videos) => {
      res.status(200).send({ videos });
    })
    .catch(console.log);
};


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

