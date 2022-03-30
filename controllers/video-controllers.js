const {
  fetchVideos,
  fetchVideoById,
  addVideo,
  patchVotesByVideoId,
  removeVideoById,
} = require("../models/video-models");

const {
  addUniqueTags,
  addVideoIdAndTags,
  checkIfTagExists,
} = require("../models/tags-models");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

exports.getVideos = (req, res, next) => {
  let tags = [];
  const sort_by = req.query.sort_by;
  const tag = req.query.tag;
  const username = req.query.username;
  let order = req.query.order;

  if (tag) {
    tags = tag.split(",");
  }
  if (order === "asc") {
    order = "ASC";
  } else if (order === "desc" || order === undefined) {
    order = "DESC";
  } else {
    order = undefined;
  }

  //check tags all exist, if not error

  const promiseArr = [];

  tags.forEach((tag) => {
    return promiseArr.push(checkIfTagExists(tag));
  });

  Promise.all(promiseArr)
    .then(() => {
      return fetchVideos(sort_by, tags, order, username);
    })
    .then((videos) => {
      res.status(200).send({ videos });
    })
    .catch((err) => {
      next(err);
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
    .catch((err) => {
      next(err);
    });
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
  ])
    .then(([body]) => {
      return Promise.all([body, addVideoIdAndTags(tags, cloudinary_id)]);
    })
    .then(([body]) => {
      res.status(201).send({ postedVideo: body[0] });
    })
    .catch(next);
};

exports.deleteVideoById = (req, res, next) => {
  const { video_id } = req.params;

  removeVideoById(video_id)
    .then((cloudId) => {
      cloudinary.uploader.destroy(cloudId, (err, result) => {
        if (err) console.log(err);
        else console.log(result);
      });
      res.status(204).end();
    })
    .catch(next);
};
