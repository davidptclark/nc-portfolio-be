const db = require("../db/connection");

exports.checkIfTagExists = (tag) => {
  return db
    .query(`SELECT * FROM tags_videos WHERE tag=$1;`, [tag])
    .then((result) => {
      if (result.rows.length === 0) {
        return Promise.reject({ status: 400, msg: `tag not found : ${tag}` });
      }
    });
};
