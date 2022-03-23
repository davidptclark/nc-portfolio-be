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

exports.fetchVideoById = (cloudinary_id) => {
  return db.query(`SELECT * FROM videos
  WHERE cloudinary_id = $1;`, [cloudinary_id])
  .then(({rows})=> {
    if(rows.length === 0) {
      return Promise.reject({
        status: 404, 
        msg: `No video found for video_id: ${cloudinary_id}`
      })
    }  
    const video = rows[0];
    return video;
  })
}

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

