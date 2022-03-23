const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const testData = require("../db/test-data/index");

afterAll(() => db.end());
beforeEach(() => seed(testData));

describe("GET - /api/videos ", () => {
  // test("status 200 - should return an array of video info", () => {
  //   return request(app)
  //     .get("/api/videos")
  //     .expect(200)
  //     .then(({ body: { videos } }) => {
  //       expect(videos.length).toBe(5);
  //       videos.forEach((video) => {
  //         expect(video).toEqual(
  //           expect.objectContaining({
  //             cloudinary_id: expect.any(String),
  //             title: expect.any(String),
  //             username: expect.any(String),
  //             votes: expect.any(Number),
  //             description: expect.any(String),
  //             created_at: expect.any(String),
  //           }),
  //         );
  //       });
  //     });
  // });
  test("status 200 - videos should be sorted by date in descending order", () => {
    const compareDates = (a, b) => {
      //creating comparison function
      if (Date.parse(a) > Date.parse(b)) {
        return -1;
      }
      if (Date.parse(b) > Date.parse(a)) {
        return 1;
      }

      return 0;
    };
    return request(app)
      .get("/api/videos")
      .expect(200)
      .then(({ body: { videos } }) => {
        expect(videos).toBeSortedBy("created_at", {
          compare: compareDates,
        });
      });
  });
  test("status 200 - videos each have a comment count property", () => {
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
  describe("queries:", () => {
    describe("sort_by", () => {
      test("status 200 - accepts sort_by=date(default),votes", () => {
        return request(app)
          .get("/api/videos?sort_by=votes")
          .expect(200)
          .then(({ body: { videos } }) => {
            expect(videos).toBeSortedBy("votes");
          });
      });

      // test("status 400 - invalid query parameter", () => {
      //   return request(app)
      //     .get("/api/videos?sort_by=voes")
      //     .expect(400)
      //     .then(({ body: { msg } }) => {
      //       expect(msg).toBe("invalid query parameter");
      //     });
      // });
    });
  });
});
