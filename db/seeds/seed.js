const { createTables, dropTables } = require("../helpers/manage-tables");
const format = require("pg-format");
const db = require("../connection");
const { convertTimestampToDate } = require("../helpers/utils");

const seed = async ({ commentData, userData, videoData, tagData }) => {
  await dropTables();
  await createTables();

  const insertUsersQueryStr = format(
    "INSERT INTO users (username, avatar_url, bio, type, social_url) VALUES %L RETURNING *;",
    userData.map(({ username, avatar_url, bio, type, social_url }) => {
      return [username, avatar_url, bio, type, social_url];
    }),
  );

  await db.query(insertUsersQueryStr).then((result) => {
    return result.rows;
  });

  const convertedVideoData = videoData.map((video) =>
    convertTimestampToDate(video),
  );

  const insertVideosQueryStr = format(
    "INSERT INTO videos (title, username, created_at, votes, description, cloudinary_id) VALUES %L RETURNING *;",
    convertedVideoData.map(
      ({ title, username, created_at, votes, description, cloudinary_id }) => {
        return [title, username, created_at, votes, description, cloudinary_id];
      },
    ),
  );
  await db.query(insertVideosQueryStr).then((result) => {
    return result.rows;
  });
};

module.exports = seed;
