const db = require("../db/connection");
exports.fetchAllTags = () => {
  return db.query("SELECT * FROM tags").then(({ rows }) => {
    return { tags: rows };
  });
};
