const {
  fetchUser,
  authenticateUser,
  updateUser,
} = require("../models/user-models");

exports.getUserForSignin = (req, res, next) => {
  const { username, password } = req.body;
  Promise.all([fetchUser(username), authenticateUser(username, password)])
    .then(([user]) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.patchUser = (req, res, next) => {
  updateUser(req.params.username, req.body)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};
