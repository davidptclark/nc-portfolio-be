const db = require("../db/connection");

exports.fetchVideos = () => {
  return db.query("SELECT * FROM videos").then((result) => {
    return result.rows;
  });
};

exports.patchVotesByVideoId = ({ vote, video_id }) => {
  if (vote === undefined) {
    return Promise.reject({ status: 404, msg: "Bad request" });
  } else {
    return db
      .query(
        "UPDATE videos SET votes = votes + $1 WHERE cloudinary_id = $2 RETURNING *",
        [vote, video_id],
      )
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Video not found" });
        } else {
          return rows[0];
        }
      });
  }
};

exports.fetchVideoById = (cloudinary_id) => {
  return db
    .query(
      `SELECT * FROM videos
  WHERE cloudinary_id = $1;`,
      [cloudinary_id],
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
      [title, username, description, cloudinary_id],
    )
    .then((result) => {
      return result.rows;
    });
};
