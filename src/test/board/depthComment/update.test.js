import request from "supertest";
import sinon from "sinon";

import app from "../../../index.js";

describe("POST /:boardId/comment/:commentId/update", () => {
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

  it("update board depth comment on a board return success message", async () => {
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
      .patch("/board/1/comment/1/depthcomment/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "Update comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");
  });

  it("update board depth comment but can't update invalid field data in body return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        field: "nothing",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Invalid column in the provided data");
  });

  it("update board depth comment but can't update field data in body return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        user_id: "2",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Invalid column in the provided data");
  });

  it("update board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/2/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "Update depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No data was found to update in table");
  });

  it("update board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/2/depthcomment/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "Update depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No data was found to update in table");
  });

  it("update board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/2/depthcomment/2/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "Update depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No data was found to update in table");
  });

  it("update board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/2/comment/1/depthcomment/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "Update depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No rows found with the provided conditions");
  });

  it("update board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/2/comment/2/depthcomment/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "Update depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No rows found with the provided conditions");
  });

  it("update board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/2/comment/1/depthcomment/2/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "Update depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No rows found with the provided conditions");
  });

  it("update board depth comment but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/2/comment/2/depthcomment/2/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "Update depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No rows found with the provided conditions");
  });

  it("update board depth comment but don't have token in authorization return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/1/update")
      .send({
        comment: "Update depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No token provided");
  });

  it("update board depth comment but have invalid token in authorization return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/1/update")
      .set("Authorization", `Bearer invalid-token`)
      .send({
        comment: "Update depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt malformed");
  });

  it("update board depth comment but have invalid token format in authorization return error message", async () => {
    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/1/update")
      .set("Authorization", `${token}`)
      .send({
        comment: "Update depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Invalid token format");
  });

  it("update board depth comment but have expired token in authorization return error message", async () => {
    clock = sinon.useFakeTimers(new Date().getTime());
    clock.tick(24 * 60 * 60 * 1000);

    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "Update depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt expired");
  });

  it("update board depth comment but have token from the future in authorization return error message", async () => {
    clock = sinon.useFakeTimers(new Date(2000, 1, 1).getTime());

    const res = await request(app)
      .patch("/board/1/comment/1/depthcomment/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        comment: "Update depth comment",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("This token was issued in the future!");
  });
});
