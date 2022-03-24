const {
  fetchVideos,
  fetchVideoById,
  addVideo,
} = require("../models/video-models");
const { checkIfTagExists } = require("../models/tag-models");
exports.getVideos = (req, res, next) => {
  let tags = [];
  const sort_by = req.query.sort_by;
  const tag = req.query.tag;
  if (tag) {
    tags = tag.split(",");
  }

  //check tags all exist, if not error

  const promiseArr = [];

  tags.forEach((tag) => {
    return promiseArr.push(checkIfTagExists(tag));
  });

  Promise.all(promiseArr)
    .then(() => {
      return fetchVideos(sort_by, tags);
    })
    .then((videos) => {
      res.status(200).send({ videos });
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
  const { title, username, description, cloudinary_id } = req.body;
  addVideo(title, username, description, cloudinary_id)
    .then((body) => {
      res.status(201).send({ postedVideo: body[0] });
    })
    .catch((err) => {
      next(err);
    });
};
