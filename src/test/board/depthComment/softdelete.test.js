import request from "supertest";
import sinon from "sinon";

import app from "../../../index.js";

describe("PACTH /:boardId/comment/:commentId/depthcomment/:depthCommentId/soft-delete", () => {
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

  it("softDelete depth comment on a board return success message", async () => {
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
      .patch("/board/1/comment/1/depthcomment/1/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");
  });

  it("soft-delete board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/2/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No data was found to delete in table");
  });

  it("soft-delete board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/2/depthcomment/1/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No data was found to delete in table");
  });

  it("soft-delete board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/2/depthcomment/2/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No data was found to delete in table");
  });

  it("soft-delete board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/2/comment/1/depthcomment/1/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No rows found with the provided conditions");
  });

  it("soft-delete board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/2/comment/2/depthcomment/1/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No rows found with the provided conditions");
  });

  it("soft-delete board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/2/comment/1/depthcomment/2/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No rows found with the provided conditions");
  });

  it("soft-delete board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/2/comment/2/depthcomment/2/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No rows found with the provided conditions");
  });

  it("soft-delete board depth comment but don't have token in authorization return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/1/soft-delete")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No token provided");
  });

  it("soft-delete board depth comment but have invalid token in authorization return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/1/soft-delete")
      .set("Authorization", `Bearer invalid-token`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt malformed");
  });

  it("soft-delete board depth comment but have invalid token format in authorization return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/1/soft-delete")
      .set("Authorization", `${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Invalid token format");
  });

  it("soft-delete board depth comment but have expired token in authorization return error message", async () => {
    clock = sinon.useFakeTimers(new Date().getTime());
    clock.tick(24 * 60 * 60 * 1000);

    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/1/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt expired");
  });

  it("soft-delete board depth comment but have token from the future in authorization return error message", async () => {
    clock = sinon.useFakeTimers(new Date(2000, 1, 1).getTime());

    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/1/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("This token was issued in the future!");
  });
});
