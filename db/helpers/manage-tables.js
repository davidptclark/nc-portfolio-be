const db = require("../connection");

const createTables = async () => {
  await db.query(`
  CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    avatar_url VARCHAR,
    bio VARCHAR,
    type VARCHAR NOT NULL,
    social_url VARCHAR,
    password VARCHAR NOT NULL
 );`);

  await db.query(`CREATE TABLE videos (
          cloudinary_id VARCHAR PRIMARY KEY,
          title VARCHAR NOT NULL,
          username VARCHAR REFERENCES users(username) NOT NULL,
          created_at TIMESTAMP DEFAULT NOW(),
          votes INT DEFAULT 0 NOT NULL,
          description VARCHAR
          );`);

  const createCommentsTable = db.query(
    `CREATE TABLE comments (
      comment_id SERIAL PRIMARY KEY,
      body VARCHAR NOT NULL,
      username VARCHAR REFERENCES users(username) NOT NULL,
      video_id VARCHAR NOT NULL REFERENCES videos(cloudinary_id),
      created_at TIMESTAMP DEFAULT NOW()
  );`
  );

  const createTagsTable = db.query(
    `CREATE TABLE tags (
      tag_id SERIAL PRIMARY KEY,
      video_id VARCHAR NOT NULL REFERENCES videos(cloudinary_id),
      tag VARCHAR NOT NULL 
      );`
  );

  await Promise.all([createCommentsTable, createTagsTable]);
};
const dropTables = async () => {
  await db.query(`DROP TABLE IF EXISTS tags;`);
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS videos;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
};

module.exports = { createTables, dropTables };
