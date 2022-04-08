const { fetchEndpointDescriptions } = require("../models/api.models.js");

exports.getEndpoints = (req, res, next) => {
  fetchEndpointDescriptions()
    .then((descriptions) => {
      res.status(200).send({ descriptions });
    })
    .catch(next);
};
