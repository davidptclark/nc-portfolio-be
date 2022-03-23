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
            }),
          );
        });
      });
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

describe("PATCH /api/videos/:video_id", () => {
  test("Returns status 200 if the patch has been succcesful", () => {
    return request(app)
      .patch("/api/videos/jsueif32")
      .send({ vote: 1 })
      .expect(200);
  });

  test("Returns the video object with the votes updated", () => {
    return request(app)
      .patch("/api/videos/jsueif32")
      .send({ vote: 3 })
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          cloudinary_id: "jsueif32",
          title: "video2",
          username: "icellusedkars",
          created_at: "2020-01-07T14:08:00.000Z",
          votes: 3,
          description: "second video",
        });
      });
  });

  test("Updates the votes correctly", () => {
    return request(app)
      .patch("/api/videos/jsueif32")
      .send({ vote: 3 })
      .expect(200)
      .then(({ body }) => {
        expect(body.votes).toBe(3);
      });
  });

  test("Returns a status 404 if the video id does not exist", () => {
    return request(app)
      .patch("/api/videos/anyrandomid123")
      .send({ vote: 3 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Video not found");
      });
  });

  test("Return a status 404 if the request object is not valid", () => {
    return request(app)
      .patch("/api/videos/jsueif32")
      .send({ notvote: 3 })
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad request");
      });
  });
});
