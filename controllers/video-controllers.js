const {
  fetchVideos,
  fetchVideoById,
  addVideo,
  patchVotesByVideoId,
  removeVideoById,
} = require("../models/video-models");

const { addUniqueTags, addVideoIdAndTags } = require("../models/tags-models");

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
exports.getVideoById = (req, res, next) => {
  const { video_id } = req.params;

  fetchVideoById(video_id)
    .then((video) => {
      res.status(200).send({ video });
    })
    .catch(next);
};

exports.postVideo = (req, res, next) => {
  const { title, username, description, cloudinary_id, tags } = req.body;
  if (!tags) {
    res
      .status(400)
      .send({ msg: "Bad Request: Tag property is missing from request body" });
  }
  Promise.all([
    addVideo(title, username, description, cloudinary_id),
    addUniqueTags(tags),
    addVideoIdAndTags(tags, cloudinary_id),
  ])
    .then(([body]) => {
      res.status(201).send({ postedVideo: body[0] });
    })
    .catch(next);
};

exports.deleteVideoById = (req, res, next) => {
  const { video_id } = req.params;

  removeVideoById(video_id)
    .then(() => {
      res.status(204).end();
    })
    .catch(next);
};
