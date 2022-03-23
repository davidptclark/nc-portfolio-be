const {
  fetchCommentsByVideoId,
  addCommentByVideoId,
} = require("../models/comments-models");
exports.getCommentsByVideoId = (req, res, next) => {
  const video_id = req.params.video_id;

  fetchCommentsByVideoId(video_id)
    .then((comments) => {
      res.status(200).send(comments);
    })
    .catch((err) => {
      next(err);
    });
};

exports.postCommentByVideoId = (req, res, next) => {
  const { body, username } = req.body;
  const { video_id } = req.params;
  addCommentByVideoId(body, username, video_id)
    .then((body) => {
      res.status(201).send({ postedComment: body[0] });
    })
    .catch((err) => {
      next(err);
    });
};
