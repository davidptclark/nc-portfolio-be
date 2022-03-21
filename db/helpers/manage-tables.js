const db = require("../connection");

const createTables = async () => {
  await db.query(`CREATE TABLE users (
    username VARCHAR PRIMARY KEY,
    name VARCHAR NOT NULL,
    avatar_url VARCHAR,
    bio VARCHAR,
    type VARCHAR NOT NULL,
    social_url VARCHAR,
 )`);

  await db.query(`CREATE TABLE videos (
        cloudinary_id VARCHAR PRIMARY KEY,
        title VARCHAR,
        username INT REFERENCES users(username) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        votes INT DEFAULT 0 NOT NULL,
        description VARCHAR,
        )`);

  db.query(
    `CREATE TABLE tags (
    tag_id SERIAL PRIMARY KEY,
    video_id VARCHAR NOT NULL REFERENCES videos(video_id),
    )`,
  );
  db.query(
    `CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY, 
    body VARCHAR NOT NULL,
    author VARCHAR REFERENCES users(username) NOT NULL,
    video_id INT NOT NULL REFERENCES videos(video_id),
    created_at TIMESTAMP DEFAULT NOW(),
)`,
  );
};
createTables();
