const db = require("../db/connection");
const bcrypt = require("bcrypt");

exports.fetchUser = (username) => {
  return db
    .query("SELECT * FROM users WHERE username=$1", [username])
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.authenticateUser = (username, password) => {
  return db
    .query("SELECT password FROM users WHERE username=$1", [username])
    .then(({ rows }) => {
      if (rows.length === 0)
        return Promise.reject({ status: 404, msg: "User Not Found" });

      return bcrypt.compare(password, rows[0].password);
    })
    .then((result) => {
      if (!result)
        return Promise.reject({ status: 401, msg: "Invalid Password" });
    });
};
