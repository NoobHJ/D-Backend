import request from "supertest";
import sinon from "sinon";

import app from "../../index.js";

describe("PATCH /board/:boardId/update", () => {
  let token;
  let clock;

  afterEach(async () => {
    if (clock) {
      await clock.restore();
    }
  });

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

    const resBoard = await request(app)
      .post("/board/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Board Title",
        detail: "Detailed Description of the Board",
        picture: "URL or path to the board photo",
      });
  });

  it("update board return success message", async () => {
    const res = await request(app)
      .patch("/board/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Board Title update",
        detail: "Detailed Description of the Board update",
        picture: "URL or path to the board photo update",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");
  });

  it("update board but can't update invalid field data in body return error message", async () => {
    const res = await request(app)
      .patch("/board/1/update")
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

  it("update board but can't update field data in body return error message", async () => {
    const res = await request(app)
      .patch("/board/1/update")
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

  it("update board but invalid board id in URL return error message", async () => {
    const res = await request(app)
      .patch("/board/2/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Board Title update invalid",
        detail: "Detailed Description of the Board update invalid",
        picture: "URL or path to the board photo update invalid",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No data was found to update in table");
  });

  it("update board but don't have token in authorization return error message", async () => {
    const res = await request(app)
      .patch("/board/1/update")
      .send({
        title: "Board Title update",
        detail: "Detailed Description of the Board update",
        picture: "URL or path to the board photo update",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No token provided");
  });

  it("update board but have invalid token in authorization return error message", async () => {
    const res = await request(app)
      .patch("/board/1/update")
      .set("Authorization", `Bearer invalid-token`)
      .send({
        title: "Board Title update",
        detail: "Detailed Description of the Board update",
        picture: "URL or path to the board photo update",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt malformed");
  });

  it("update board but have invalid token format in authorization return error message", async () => {
    const res = await request(app)
      .patch("/board/1/update")
      .set("Authorization", `${token}`)
      .send({
        title: "Board Title update",
        detail: "Detailed Description of the Board update",
        picture: "URL or path to the board photo update",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Invalid token format");
  });

  it("update board but have expired token in authorization return error message", async () => {
    clock = sinon.useFakeTimers(new Date().getTime());
    clock.tick(24 * 60 * 60 * 1000);

    const res = await request(app)
      .patch("/board/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Board Title update",
        detail: "Detailed Description of the Board update",
        picture: "URL or path to the board photo update",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt expired");
  });

  it("update board but have token from the future in authorization return error message", async () => {
    clock = sinon.useFakeTimers(new Date(2000, 1, 1).getTime());

    const res = await request(app)
      .patch("/board/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Board Title update",
        detail: "Detailed Description of the Board update",
        picture: "URL or path to the board photo update",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("This token was issued in the future!");
  });
});
