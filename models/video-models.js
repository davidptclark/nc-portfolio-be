const db = require("../db/connection");

exports.fetchVideos = (sort_by = "created_at") => {
  if (!["created_at", "votes"].includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid query parameter" });
  }
  let queryStr =
    "SELECT title, videos.username, videos.created_at, votes, description, cloudinary_id, COUNT(comments.video_id) AS comment_count FROM videos JOIN comments ON videos.cloudinary_id = comments.video_id ";

  queryStr += ` GROUP BY videos.cloudinary_id ORDER BY ${sort_by} DESC;`;

  return db.query(queryStr).then((result) => {
    return result.rows;
  });
};
