const db = require("../db/connection");

exports.fetchUser = (username) => {
  return db
    .query("SELECT * FROM users WHERE username=$1", [username])
    .then(({ rows }) => {
      return rows[0];
    });
};
