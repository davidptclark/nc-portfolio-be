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

exports.updateUser = (username, { bio, social_url, avatar_url }) => {
  return db
    .query(
      `UPDATE users SET 
    bio=$1,
    social_url=$2,
    avatar_url=$3 
    WHERE username=$4 
    RETURNING username,type,bio,social_url,avatar_url`,
      [bio, social_url, avatar_url, username]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};
