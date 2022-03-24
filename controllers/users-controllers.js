const {
  fetchUser,
  authenticateUser,
  updateUser,
  insertUser,
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

exports.getUser = (req, res, next) => {
  const { username } = req.params;
  fetchUser(username)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  insertUser(req.body)
    .then((user) => {
      res.status(201).send({ user });
    })
    .catch(next);
};
