const { fetchAllTags } = require("../models/tags-models");

exports.getAllTags = (req, res, next) => {
  fetchAllTags()
    .then((tags) => {
      res.status(200).send(tags);
    })
    .catch((err) => {
      next(err);
    });
};
