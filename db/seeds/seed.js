const { createTables, dropTables } = require("../helpers/manage-tables");
async function setTables() {
  await dropTables();
  createTables();
}

setTables();
