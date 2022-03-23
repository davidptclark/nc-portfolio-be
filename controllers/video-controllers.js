const { fetchVideos } = require("../models/video-models");
const { addVideo } = require("../models/video-models");

exports.getVideos = (req, res) => {
  fetchVideos().then((videos) => {
    res.status(200).send({ videos });
  });
};

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
