const db = require("../db/connection");

exports.fetchVideos = () => {
  return db.query("SELECT * FROM videos").then((result) => {
    return result.rows;
  });
};

exports.fetchVideoById = (video_id) => {
  return db.query(`SELECT * FROM videos
  WHERE cloudinary_id = $1;`, [video_id])
  .then(({rows})=> {
    if(rows.length === 0) {
      return Promise.reject({
        status: 404, 
        msg: `No video found for video_id: ${video_id}`
      })
    }  
    const video = rows[0];
    return video;
  })
}
