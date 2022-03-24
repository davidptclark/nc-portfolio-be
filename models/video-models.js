const db = require("../db/connection");

exports.fetchVideos = (sort_by = "created_at", tags, order) => {
  if (!["created_at", "votes"].includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "invalid query parameter" });
  }
  if (!order) {
    return Promise.reject({
      status: 400,
      msg: "order invalid -  should be 'asc or 'desc'",
    });
  }
  const parArr = [];
  let queryStr = `SELECT title, videos.username, videos.created_at, votes, description, cloudinary_id, COUNT(comments.video_id) AS comment_count, COALESCE(t_a.tag_array, '{}') AS video_tag_array FROM videos LEFT JOIN comments ON videos.cloudinary_id = comments.video_id LEFT JOIN (SELECT tags_videos.video_id, ARRAY_AGG(tag) AS tag_array FROM tags_videos GROUP BY tags_videos.video_id) t_a ON videos.cloudinary_id = t_a.video_id `;
  if (tags) {
    tags.forEach((tag, index) => {
      if (index === 0) {
        queryStr += `WHERE videos.cloudinary_id = ANY(SELECT video_id FROM tags_videos WHERE tag=$${
          parArr.length + 1
        }) `;
        parArr.push(tag);
      } else {
        queryStr += `AND videos.cloudinary_id = ANY(SELECT video_id FROM tags_videos WHERE tag=$${
          parArr.length + 1
        }) `;
        parArr.push(tag);
      }
    });
  }
  queryStr += `GROUP BY videos.cloudinary_id, video_tag_array ORDER BY ${sort_by} ${order};`;

  return db.query(queryStr, parArr).then((result) => {
    return result.rows;
  });
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
