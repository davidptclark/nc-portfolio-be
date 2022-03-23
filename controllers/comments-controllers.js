const { fetchCommentsByVideoId } = require("../models/comments-models");
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
