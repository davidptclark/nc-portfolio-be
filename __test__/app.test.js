const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const testData = require("../db/test-data/index");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("/api/videos ", () => {
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

describe("/api/users/:username", () => {
  describe("GET", () => {
    test("Status:200 - Returns user object", () => {
      return request(app)
        .get("/api/users/butter_bridge")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toMatchObject({
            username: "butter_bridge",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            bio: "I love making videos for NC",
            type: "graduate",
            social_url: "www.example.com",
          });
        });
    });
    test("Status:404 - Invaid username", () => {
      return request(app)
        .get("/api/users/Invald")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("User Not Found");
        });
    });
  });
});

describe("api/comments/:video_id", () => {
  test("GET should return a status 200 if the video_id is in the database", () => {
    return request(app).get("/api/comments/789amsje").expect(200);
  });
  test("GET returns an array of objects.", () => {
    return request(app)
      .get("/api/comments/789amsje")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        body.forEach((element) => {
          expect(element.constructor).toBe(Object);
        });
      });
  });

  test("GET each comment object has the required keys and datatypes", () => {
    return request(app)
      .get("/api/comments/789amsje")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body)).toBe(true);
        body.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: expect.any(String),
              username: expect.any(String),
              video_id: expect.any(String),
              created_at: expect.any(String),
            }),
          );
        });
      });
  });

  test("GET returns a 404 if the the required video id is not found", () => {
    return request(app)
      .get("/api/comments/2344afadsfasd")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Path not found");
      });
  });

  test("GET returns the comments sorted by date in descending order", () => {
    return request(app)
      .get("/api/comments/789amsje")
      .expect(200)
      .then(({ body }) => {
        const dates = body.map((comment) => {
          return comment.created_at;
        });

        expect(dates).toEqual([
          "2020-10-11T15:23:00.000Z",
          "2020-09-19T23:10:00.000Z",
          "2020-07-21T00:20:00.000Z",
          "2020-06-20T07:24:00.000Z",
        ]);
      });
  });
  test("GET all the comments returned are asociated to the correct video id", () => {
    return request(app)
      .get("/api/comments/789amsje")
      .expect(200)
      .then(({ body }) => {
        body.map((comment) => {
          expect(comment.video_id).toBe("789amsje");
        });
      });
  });
});
