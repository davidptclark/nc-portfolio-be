exports.handleNonPSQLErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "bad request" });
  } else if (err.code === "23502") {
    res
      .status(400)
      .send({ msg: `${err.column} cannot be an empty string/null` });
  } else if (err.code === "23514") {
    res
      .status(400)
      .send({ msg: "Cloudinary ID cannot be an empty string/null" });
  } else if (err.code === "23503") {
    res.status(404).send({ msg: err.detail });
  } else if (err.code === "23505") {
    res.status(400).send({ msg: "User already exists" });
  } else next(err);
};

exports.handle500s = (err, req, res, next) => {
  res.status(500).send({ msg: "internal server error" });
};
