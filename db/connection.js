const { Pool } = require("pg");
const ENV = process.env.NODE_ENV || "development";
console.log(process.env.PGDATABASE, "<<<<<PGDATABASE");
console.log(ENV, "<<<<<ENV");

require("dotenv").config({
  path: `${__dirname}/../.env.${ENV}`,
});

if (!process.env.PGDATABASE && !process.env.DATABASE_URL) {
  throw new Error("PGDATABASE or DATABASE_URL not set");
}
const config =
  ENV === "production"
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {};
module.exports = new Pool(config);

//Currently ENV is development until we start testing.
//Tomorrow we should finish seeding the database.
// Start the endpoints on App.js create controlle and module files.
// Start testing
