import request from "supertest";
import app from "../../../index.js";

describe("GET /board/:boardId/comment", () => {
  let token;

  beforeAll(async () => {
    const resUser = await request(app)
      .post("/auth/login/google")
      .send({
        user: {
          id: 1,
          email: "example1@gmail.com",
          name: "example1",
        },
      });

    token = resUser.body.token;

    const createBoardRes = await request(app)
      .post("/board/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Board Title",
        detail: "Detailed Description of the Board",
        picture: "URL or path to the board photo",
      });
  });

  it("get board comments return success message and comments data", async () => {
    const createCommentRes = await request(app)
      .post(`/board/1/comment/create`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "This is a test comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(201);

    const res = await request(app)
      .get("/board/1/comment")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");

    expect(res.body).toHaveProperty("boardComment");
    expect(typeof res.body.boardComment).toBe("object");
    expect(res.body.boardComment.length).not.toBe(0);
  });

  it("get board comments invalid board id in URL return error message", async () => {
    const res = await request(app)
      .get("/board/2/comment")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No data found with the provided criteria");
  });
});
