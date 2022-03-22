const db = require("../db/connection");

exports.fetchVideos = () => {
  return db
    .query("SELECT * FROM videos ORDER BY created_at DESC;")
    .then((result) => {
      console.log(result.rows);
      return result.rows;
    });
};
