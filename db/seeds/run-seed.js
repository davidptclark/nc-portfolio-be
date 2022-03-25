const devData = require("../dev-data/index.js"); //Change to reflect index file in dev-data dir.
const seed = require("./seed.js");
const db = require("../connection.js");

const runSeed = () => {
  return seed(devData).then(() => db.end()); //Seed using new variable linking to dev-data
};

runSeed();
