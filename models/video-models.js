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
