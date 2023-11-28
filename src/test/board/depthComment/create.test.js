import request from "supertest";
import sinon from "sinon";

import app from "../../../index.js";

describe("POST /:boardId/comment/:commentId/create", () => {
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

  it("create board depth comment on a board return success message", async () => {
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

    const res = await request(app)
      .post(`/board/1/comment/create`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "This is a test comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(201);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");
  });

  it("create board depth comment return success message", async () => {
    const res = await request(app)
      .post(`/board/1/comment/1/create`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "This is a test depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(201);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");
  });

  it("create board depth comment on a board but missing body data return error message", async () => {
    const res = await request(app)
      .post(`/board/1/comment/1/create`)
      .set("Authorization", `Bearer ${token}`)
      .send({})
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Body data is not provided");
  });

  it("create board depth comment have expired token in authorization return error message", async () => {
    clock = sinon.useFakeTimers(new Date().getTime());
    clock.tick(24 * 60 * 60 * 1000);

    const res = await request(app)
      .post(`/board/1/comment/1/create`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "This is a test comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt expired");
  });

  it("create board depth comment on a board but no token in authorization return error message", async () => {
    const res = await request(app)
      .post(`/board/1/comment/1/create`)
      .send({
        comment: "This is a test comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No token provided");
  });
});
