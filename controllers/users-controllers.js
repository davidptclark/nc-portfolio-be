const { fetchUser } = require("../models/user-models");

exports.getUser = (req, res, next) => {
  fetchUser(req.params.username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
