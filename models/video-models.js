const db = require("../db/connection");

exports.fetchVideos = () => {
  return db.query("SELECT * FROM videos").then((result) => {
    return result.rows;
  });
};
