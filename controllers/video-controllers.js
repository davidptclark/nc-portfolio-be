
const { fetchVideos, fetchVideoById, addVideo, removeVideoById } = require("../models/video-models");

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

exports.deleteVideoById = (req, res, next) => {
  const {video_id} = req.params;

  removeVideoById(video_id)
  .then(() => {
    res.status(204).end()
  })
  .catch(next)

}