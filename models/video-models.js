const db = require("../db/connection");

exports.fetchVideos = () => {
  return db.query("SELECT * FROM videos").then((result) => {
    return result.rows;
  });
};

exports.fetchVideoById = (cloudinary_id) => {
  return db
    .query(
      `SELECT * FROM videos
  WHERE cloudinary_id = $1;`,
      [cloudinary_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No video found for video_id: ${cloudinary_id}`,
        });
      }
      const video = rows[0];
      return video;
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

exports.removeVideoById = (cloudinary_id) => {
  return db
    .query(
      `DELETE FROM videos
    WHERE videos.cloudinary_id = $1
    RETURNING *;`,
      [cloudinary_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No video found for video_id: ${cloudinary_id}`,
        });
      }
    });
};
