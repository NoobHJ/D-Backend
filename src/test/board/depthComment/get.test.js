import request from "supertest";
import app from "../../../index.js";

describe("GET /:boardId/comment/:commentId", () => {
  let token;
  let clock;

  afterEach(async () => {
    if (clock) {
      await clock.restore();
    }
  });

  beforeAll(async () => {
    const res = await request(app)
      .post("/auth/login/google")
      .send({
        user: {
          id: 1,
          email: "example1@gmail.com",
          name: "example1",
        },
      });

    token = res.body.token;
  });

  it("get depth comment on a board return success message", async () => {
    const createBoardRes = await request(app)
      .post("/board/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Board Title",
        detail: "Detailed Description of the Board",
        picture: "URL or path to the board photo",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(201);

    const createCommentResres = await request(app)
      .post(`/board/1/comment/create`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "This is a test comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(201);

    const createBoardDepthCommentres = await request(app)
      .post(`/board/1/comment/1/create`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "This is a test depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(201);

    const res = await request(app)
      .get("/board/1/comment/1")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");

    expect(res.body).toHaveProperty("BoardDepthComment");
    expect(typeof res.body.BoardDepthComment).toBe("object");
    expect(res.body.BoardDepthComment.length).not.toBe(0);
  });

  it("get depth comment invalid board id in URL return error message", async () => {
    const res = await request(app)
      .get("/board/1/comment/2")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No data found with the provided criteria");
  });
});
