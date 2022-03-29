const db = require("../db/connection");

exports.fetchCommentsByVideoId = (video_id) => {
  return db
    .query(
      "SELECT * FROM comments WHERE video_id = $1 ORDER BY created_at DESC",
      [video_id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Path not found" });
      } else {
        return rows;
      }
    });
};

exports.addCommentByVideoId = (body, username, video_id) => {
  return db
    .query(
      "INSERT INTO comments (body, username, video_id) VALUES ($1, $2, $3) RETURNING *;",
      [body, username, video_id]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.removeCommentByCommentId = (comment_id) => {
  return db
    .query(`DELETE FROM comments  WHERE comment_id = $1 RETURNING *;`, [
      comment_id,
    ])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment_id: ${comment_id}`,
        });
      }
    });
};
