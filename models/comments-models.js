const db = require("../db/connection");
exports.fetchCommentsByVideoId = (video_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE video_id = $1 ORDER BY created_at DESC",
      [video_id],
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Path not found" });
      } else {
        return rows;
      }
    });
};
