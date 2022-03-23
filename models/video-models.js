const db = require("../db/connection");

exports.fetchVideos = () => {
  return db.query("SELECT * FROM videos").then((result) => {
    return result.rows;
  });
};

exports.addVideo = (title, username, description, cloudinary_id) => {
  return db
    .query(
      "INSERT INTO videos (title, username, description, cloudinary_id) VALUES ($1, $2, $3, $4) RETURNING *;",
      [title, username, description, cloudinary_id]
    )
    .then((result) => {
      return result.rows;
    });
};
