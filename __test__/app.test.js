const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const testData = require("../db/test-data/index");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("api/videos ", () => {
  test("GET, should return an object", () => {
    return request(app)
      .get("/api/videos")
      .expect(200)
      .then(({ body: { videos } }) => {
        expect(videos.length).toBe(5);
        videos.forEach((video) => {
          expect(video).toEqual(
            expect.objectContaining({
              cloudinary_id: expect.any(String),
              title: expect.any(String),
              username: expect.any(String),
              votes: expect.any(Number),
              description: expect.any(String),
              created_at: expect.any(String),
            })
          );
        });
      });
  });
});

describe("api/videos ", () => {
  describe("POST video", () => {
    test("Status: 200 - should post a video and return object with posted video", () => {
      const testVideo = {
        title: "My new React Project",
        username: "icellusedkars",
        description: "This a front-end project using React and MUI.",
        cloudinary_id: "adsf89adz",
      };
      return request(app)
        .post("/api/videos")
        .send(testVideo)
        .expect(201)
        .then(({ body: { postedVideo } }) => {
          expect(postedVideo).toEqual(
            expect.objectContaining({
              title: "My new React Project",
              votes: 0,
              created_at: expect.any(String),
              username: "icellusedkars", //CAREFUL: this user MUST be registered and be within users table before commenting otherwise violates FK constraint
              description: "This a front-end project using React and MUI.",
              cloudinary_id: "adsf89adz",
            })
          );
        });
    });
    test("Status: 404 - should respond with error message if unregistered user", () => {
      const testVideo = {
        title: "My new React Project",
        username: "not-a-user",
        description: "This a front-end project using React and MUI.",
        cloudinary_id: "adsf89adz",
      };
      return request(app)
        .post("/api/videos")
        .send(testVideo)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'Key (username)=(not-a-user) is not present in table "users".'
          );
        });
    });
    test("Status: 400 - should respond with error message if Cloudinary ID is an empty string", () => {
      const testVideo = {
        title: "My new React Project",
        username: "not-a-user",
        description: "This a front-end project using React and MUI.",
        cloudinary_id: "",
      };
      return request(app)
        .post("/api/videos")
        .send(testVideo)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Cloudinary ID cannot be an empty string");
        });
    });
    test('Status: 400 - responds with message "missing fields in request" when passed object with missing keys required by SQL table rules', () => {
      const testVideo = {
        username: "icellusedkars",
        cloudinary_id: "adsf89adz",
        description: "This a front-end project using React and MUI.",
      };
      return request(app)
        .post("/api/videos")
        .send(testVideo)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("title cannot be an empty string");
        });
    });
  });
});
