const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const testData = require("../db/test-data/index");
const { compareDates } = require("../db/helpers/utils");

afterAll(() => db.end());
beforeEach(() => {
  return seed(testData);
});

describe("/api/videos", () => {
  describe("GET", () => {
    test("Status:200 - should return an array of video info", () => {
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
    test("Status:200 - videos should be sorted by date in descending order", () => {
      return request(app)
        .get("/api/videos")
        .expect(200)
        .then(({ body: { videos } }) => {
          expect(videos).toBeSortedBy("created_at", {
            compare: compareDates,
            descending: true,
          });
        });
    });
    test("Status:200 - videos each have a comment count property", () => {
      return request(app)
        .get("/api/videos")
        .expect(200)
        .then(({ body: { videos } }) => {
          videos.forEach((video) => {
            expect(video).toEqual(
              expect.objectContaining({ comment_count: expect.any(String) }),
            );
          });
        });
    });
    test("Status:200 - videos each have an array of tags property", () => {
      return request(app)
        .get("/api/videos")
        .expect(200)
        .then(({ body: { videos } }) => {
          videos.forEach((video) => {
            expect(video).toEqual(
              expect.objectContaining({ video_tag_array: expect.any(Array) }),
            );
          });
        });
    });

    describe("Queries:", () => {
      describe("Order", () => {
        test("Status:200 - accepts order query by asc, desc (default)", () => {
          return request(app)
            .get("/api/videos?order=asc")
            .expect(200)
            .then(({ body: { videos } }) => {
              expect(videos).toBeSortedBy("created_at", {
                compare: compareDates,
              });
            });
        });
        test("Status:400 - invalid order value", () => {
          return request(app)
            .get("/api/videos?order=asce")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("order invalid -  should be 'asc or 'desc'");
            });
        });
      });
      describe("Tag", () => {
        test("Status:200 - accepts query for a single tag", () => {
          return request(app)
            .get("/api/videos?tag=javascript")
            .expect(200)
            .then(({ body: { videos } }) => {
              expect(videos).toHaveLength(2);
            });
        });

        test("Status:200 - accepts query for multiple tags", () => {
          return request(app)
            .get("/api/videos?tag=javascript,express")
            .expect(200)
            .then(({ body: { videos } }) => {
              expect(videos).toHaveLength(1);
            });
        });
        test("Status:400 - at least one tag doesn't exist", () => {
          return request(app)
            .get("/api/videos?tag=ja")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("tag not found : ja");
            });
        });
      });
      describe("Sort_by", () => {
        test("Status:200 - accepts sort_by=date(default),votes", () => {
          return request(app)
            .get("/api/videos?sort_by=votes")
            .expect(200)
            .then(({ body: { videos } }) => {
              expect(videos).toBeSortedBy("votes");
            });
        });

        test("Status:400 - invalid query parameter", () => {
          return request(app)
            .get("/api/videos?sort_by=voes")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).toBe("invalid query parameter");
            });
        });
      });
    });
  });
  describe("POST", () => {
    test("Status:201 - should post a video and return object with posted video", () => {
      const testVideo = {
        title: "My new React Project",
        username: "icellusedkars",
        description: "This a front-end project using React and MUI.",
        cloudinary_id: "adsf89adz",
        tags: ["vue", "redux", "javascript", "python"],
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
            }),
          );
        });
    });
    test("Status:201 - should post a video and only unique tags should be in the tag table", () => {
      const testVideo = {
        title: "My new React Project",
        username: "icellusedkars",
        description: "This a front-end project using React and MUI.",
        cloudinary_id: "adsf89adz",
        tags: ["vue", "redux", "javascript", "python"], //Two new tags, two existing tags
      };
      return request(app)
        .post("/api/videos")
        .send(testVideo)
        .expect(201)
        .then(() => {
          return db.query("SELECT * FROM tags");
        })
        .then(({ rows }) => {
          expect(rows.length).toBe(10);
        });
    });
    test("Status:201 - should post a video and add one instance of video id with each tag in tags_video table", () => {
      const testVideo = {
        title: "My new React Project",
        username: "icellusedkars",
        description: "This a front-end project using React and MUI.",
        cloudinary_id: "adsf89adz",
        tags: ["vue", "redux", "javascript", "python"], //Two new tags, two existing tags
      };
      return request(app)
        .post("/api/videos")
        .send(testVideo)
        .expect(201)
        .then(() => {
          return db.query("SELECT * FROM tags_videos");
        })
        .then(({ rows }) => {
          expect(rows.length).toBe(11);
          expect(
            rows.filter((row) => row.video_id === "adsf89adz").length,
          ).toBe(4);
        });
    });
    test("Status:400 - should respond with error message if no tags are supplied", () => {
      const testVideo = {
        title: "My new React Project",
        username: "icellusedkars",
        description: "This a front-end project using React and MUI.",
        cloudinary_id: "adsf89adz",
        tags: [],
      };
      return request(app)
        .post("/api/videos")
        .send(testVideo)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request: No tags provided");
        });
    });
    test("Status:400 - should respond with error message if tag property is missing from object", () => {
      const testVideo = {
        title: "My new React Project",
        username: "icellusedkars",
        description: "This a front-end project using React and MUI.",
        cloudinary_id: "adsf89adz",
      };
      return request(app)
        .post("/api/videos")
        .send(testVideo)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            "Bad Request: Tag property is missing from request body",
          );
        });
    });
    test("Status:404 - should respond with error message if unregistered user", () => {
      const testVideo = {
        title: "My new React Project",
        username: "not-a-user",
        description: "This a front-end project using React and MUI.",
        cloudinary_id: "adsf89adz",
        tags: ["vue", "redux", "javascript", "python"],
      };
      return request(app)
        .post("/api/videos")
        .send(testVideo)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'Key (username)=(not-a-user) is not present in table "users".',
          );
        });
    });
    test("Status:400 - should respond with error message if Cloudinary ID is an empty string", () => {
      const testVideo = {
        title: "My new React Project",
        username: "not-a-user",
        description: "This a front-end project using React and MUI.",
        cloudinary_id: "",
        tags: ["vue", "redux", "javascript", "python"],
      };
      return request(app)
        .post("/api/videos")
        .send(testVideo)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Cloudinary ID cannot be an empty string/null");
        });
    });
    test("Status:400 - responds with error message when passed object with missing keys required by SQL table rules", () => {
      const testVideo = {
        username: "icellusedkars",
        cloudinary_id: "adsf89adz",
        description: "This a front-end project using React and MUI.",
        tags: ["vue", "redux", "javascript", "python"],
      };
      return request(app)
        .post("/api/videos")
        .send(testVideo)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("title cannot be an empty string/null");
        });
    });
  });
});

describe("/api/users/:username", () => {
  describe("PATCH", () => {
    test("Status:200 - Returns patched user", () => {
      return request(app)
        .patch("/api/users/butter_bridge")
        .send({
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
          bio: "I love making videos for NC woo",
          social_url: "www.example-changed.com",
        })
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).toMatchObject({
            username: "butter_bridge",
            avatar_url:
              "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
            bio: "I love making videos for NC woo",
            type: "graduate",
            social_url: "www.example-changed.com",
          });
        });
    });
    test("Status:400 - Invalid body", () => {
      return request(app)
        .patch("/api/users/butter_bridge")
        .send({
          avatar_url:
            "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    test("Status:400 - Invalid body data", () => {
      return request(app)
        .patch("/api/users/butter_bridge")
        .send({
          avatar_url: "asdf",
          bio: "bio",
          social_url: 345,
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
  });
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
    test("Status:404 - Invalid username", () => {
      return request(app)
        .get("/api/users/Invalid")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("User Not Found");
        });
    });
  });
});

describe("/api/comments/:video_id", () => {
  describe("GET", () => {
    test("Status:200 - should return a status 200 if the video_id is in the database", () => {
      return request(app).get("/api/comments/789amsje").expect(200);
    });
    test("Status:200 - returns an array of objects.", () => {
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

    test("Status:200 - each comment object has the required keys and datatypes", () => {
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

    test("Status:404 - required video id is not found", () => {
      return request(app)
        .get("/api/comments/2344afadsfasd")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Path not found");
        });
    });

    test("Status:200 - returns the comments sorted by date in descending order", () => {
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
    test("Status:200 - all the comments returned are asociated to the correct video id", () => {
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
});

describe("/api/comments", () => {
  describe("POST", () => {
    test("Status:201 - should post comment to chosen video and return object body from table", () => {
      const testComment = {
        body: "Great idea!",
        username: "icellusedkars",
      };
      return request(app)
        .post("/api/comments/adsf89adf")
        .send(testComment)
        .expect(201)
        .then(({ body: { postedComment } }) => {
          expect(postedComment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              body: "Great idea!",
              username: "icellusedkars",
              video_id: "adsf89adf",
              created_at: expect.any(String),
            }),
          );
        });
    });
    test("Status:404 - should respond with error message if unregistered user", () => {
      const testComment = {
        body: "Great idea!",
        username: "not-a-user",
      };
      return request(app)
        .post("/api/comments/adsf89adf")
        .send(testComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'Key (username)=(not-a-user) is not present in table "users".',
          );
        });
    });
    test("Status:400 - responds with message when passed object with missing keys required by SQL table rules", () => {
      const testComment = {
        username: "not-a-user",
      };
      return request(app)
        .post("/api/comments/adsf89adf")
        .send(testComment)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("body cannot be an empty string/null");
        });
    });
    test("Status:404 - should respond with error message when a non-existent video id is given", () => {
      const testComment = {
        body: "Great idea!",
        username: "icellusedkars",
      };
      return request(app)
        .post("/api/comments/not-an-id")
        .send(testComment)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe(
            'Key (video_id)=(not-an-id) is not present in table "videos".',
          );
        });
    });
  });
});

describe("/api/videos/:video_id", () => {
  describe("GET", () => {
    test("Status:200 - Gets a video based on the cloudinary id supplied", () => {
      return request(app)
        .get("/api/videos/iujdhsnd")

        .expect(200)

        .then(({ body: { video } }) => {
          expect(video).toEqual(
            expect.objectContaining({
              title: "video4",
              username: "paul",
              created_at: expect.any(String),
              votes: 0,
              description: "fourth video",
              cloudinary_id: "iujdhsnd",
            }),
          );
        });
    });
    test("Status:200 - video has comment_count property", () => {
      return request(app)
        .get("/api/videos/iujdhsnd")
        .expect(200)
        .then(({ body: { video } }) => {
          expect(video).toEqual(
            expect.objectContaining({
              comment_count: expect.any(String),
            }),
          );
        });
    });
    test("Status:200 - video has video_tag_array property", () => {
      return request(app)
        .get("/api/videos/iujdhsnd")
        .expect(200)
        .then(({ body: { video } }) => {
          expect(video).toEqual(
            expect.objectContaining({ video_tag_array: expect.any(Array) }),
          );
        });
    });
    test("Status:404 - The video requested doesn't exist", () => {
      return request(app)
        .get("/api/videos/non-existant")
        .expect(404)
        .then((response) => {
          expect(response.body).toEqual({
            msg: "No video found for video_id: non-existant",
          });
          expect(response.status).toBe(404);
        });
    });
  });
  describe("DELETE", () => {
    test("Status:204 - Deletes a video when passed its id", () => {
      return request(app)
        .delete("/api/videos/iujdhsnd")
        .expect(204)
        .then(() => {
          return request(app)
            .get("/api/videos")
            .expect(200)
            .then(({ body: { videos } }) => {
              expect(videos.length).toBe(4);
              for (let i = 0; i < videos.length; i++) {
                expect(videos[i].cloudinary_id).not.toBe("iujdhsnd");
              }
              return db.query(
                `SELECT * FROM videos WHERE cloudinary_id = 'iujdhsnd';`,
              );
            })
            .then(({ rows }) => {
              expect(rows).toEqual([]);
            });
        });
    });

    test("Status:404 - The video to delete does not exist", () => {
      return request(app)
        .delete("/api/videos/non-existant")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("No video found for video_id: non-existant");
        });
    });
  });
  describe("PATCH", () => {
    test("Status:200 - Returns status 200 if the patch has been succcesful", () => {
      return request(app)
        .patch("/api/videos/jsueif32")
        .send({ vote: 1 })
        .expect(200);
    });

    test("Status:200 - Returns the video object with the votes updated", () => {
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

    test("Status:200 - Returns the video object with the votes updated even when the vote is negative", () => {
      return request(app)
        .patch("/api/videos/jsueif32")
        .send({ vote: -4 })
        .expect(200)
        .then(({ body }) => {
          expect(body).toEqual({
            cloudinary_id: "jsueif32",
            title: "video2",
            username: "icellusedkars",
            created_at: "2020-01-07T14:08:00.000Z",
            votes: -4,
            description: "second video",
          });
        });
    });

    test("Status:200 - Updates the votes correctly", () => {
      return request(app)
        .patch("/api/videos/jsueif32")
        .send({ vote: 3 })
        .expect(200)
        .then(({ body }) => {
          expect(body.votes).toBe(3);
        });
    });

    test("Status:404 - the video id does not exist", () => {
      return request(app)
        .patch("/api/videos/anyrandomid123")
        .send({ vote: 3 })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Video not found");
        });
    });

    test("Status:400 - the request object is not valid", () => {
      return request(app)
        .patch("/api/videos/jsueif32")
        .send({ notvote: 3 })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad request");
        });
    });
  });
});

describe("/api/tags", () => {
  describe("GET", () => {
    test("Status:200 - If the request is succesful returns a status 200", () => {
      return request(app).get("/api/tags").expect(200);
    });
    test("Status:200 - Returns an object with an array of tags on the key 'tags'", () => {
      return request(app)
        .get("/api/tags")
        .expect(200)
        .then(({ body }) => {
          expect(body.constructor).toBe(Object);
          expect(body.tags.constructor).toBe(Array);
        });
    });

    test("Status:200 - Returns the correct tags", () => {
      return request(app)
        .get("/api/tags")
        .expect(200)
        .then(({ body: tags }) => {
          expect(tags).toEqual({
            tags: [
              { tag: "javascript" },
              { tag: "python" },
              { tag: "aws" },
              { tag: "express" },
              { tag: "react-native" },
              { tag: "jest" },
              { tag: "frontend" },
              { tag: "backend" },
            ],
          });
        });
    });
  });
});

describe("/api/signin", () => {
  describe("POST", () => {
    test("Status:200 - Returns user object", () => {
      return request(app)
        .post("/api/signin")
        .send({
          username: "butter_bridge",
          password: "Password1",
        })
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
        .post("/api/signin")
        .send({
          username: "Invalid",
          password: "Password1",
        })
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("User Not Found");
        });
    });
    test("Status:401 -Invalid Password", () => {
      return request(app)
        .post("/api/signin")
        .send({ username: "butter_bridge", password: "Invalid" })
        .expect(401)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Invalid Password");
        });
    });
  });
});

describe("/api/users", () => {
  describe("POST", () => {
    test("Status:201 - Returns created user", () => {
      return request(app)
        .post("/api/users")
        .send({
          username: "Test",
          password:
            "$2b$05$alD9XX/ESmHfKBDMMKjHcuCkmOyA5U4eL52hoBJtMn829eGrJ57.C",
          type: "graduate",
        })
        .expect(201)
        .then(({ body: { user } }) => {
          expect(user).toMatchObject({
            username: "Test",
            avatar_url: null,
            bio: null,
            type: "graduate",
            social_url: null,
          });
        });
    });
    test("Status:400 - Invalid body", () => {
      return request(app)
        .post("/api/users")
        .send({ username: "hello" })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
    test("Status:400 - Invalid type", () => {
      return request(app)
        .post("/api/users")
        .send({
          username: "Test",
          password:
            "$2b$05$alD9XX/ESmHfKBDMMKjHcuCkmOyA5U4eL52hoBJtMn829eGrJ57.C",
          type: "Invalid",
        })
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("Bad Request");
        });
    });
  });
});
