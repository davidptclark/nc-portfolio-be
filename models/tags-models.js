const db = require("../db/connection");
const format = require("pg-format");

exports.fetchAllTags = () => {
  return db.query("SELECT * FROM tags").then(({ rows }) => {
    return { tags: rows };
  });
};

exports.checkIfTagExists = (tag) => {
  return db
    .query(`SELECT * FROM tags_videos WHERE tag=$1;`, [tag])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 400, msg: `tag not found : ${tag}` });
      }
    });
};

exports.addUniqueTags = (tags) => {
  if (tags.length === 0) {
    return Promise.reject({
      status: 400,
      msg: "Bad Request: No tags provided",
    });
  }

  const formattedTags = tags.map((tagName) => {
    return { tag: tagName };
  });

  const insertTagsQueryStr = format(
    "INSERT INTO tags (tag) VALUES %L ON CONFLICT DO NOTHING RETURNING *;", //Will ignore duplicates and move to the next tag
    formattedTags.map(({ tag }) => [tag]),
  );

  return db.query(insertTagsQueryStr);
};

exports.addVideoIdAndTags = (tags, cloudinary_id) => {
  const formattedTags = tags.map((tagName) => {
    return { videoId: cloudinary_id, tag: tagName };
  });

  const insertTagsVideosQueryStr = format(
    "INSERT INTO tags_videos (video_id, tag) VALUES %L RETURNING *;",
    formattedTags.map(({ videoId, tag }) => {
      return [videoId, tag];
    }),
  );

  return db.query(insertTagsVideosQueryStr);
};
