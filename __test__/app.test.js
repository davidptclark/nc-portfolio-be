const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const testData = require("../db/test-data/index");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("api/videos ", () => {
  test("GET, shuld return an object", () => {
    return request(app)
      .get("/api/videos")
      .expect(200)
      .then(({ body }) => {});
  });
});
