const { fetchVideos } = require("../models/videoModels");
exports.getVideos = (req, res) => {
  const sort_by = req.query.sort_by;

  fetchVideos(sort_by)
    .then((videos) => {
      res.status(200).send({ videos });
    })
    .catch(console.log);
};
