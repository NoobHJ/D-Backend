import request from "supertest";
import sinon from "sinon";

import app from "../../index.js";

describe("POST /board/create", () => {
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

  it("create board return success message", async () => {
    const res = await request(app)
      .post("/board/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Board Title",
        detail: "Detailed Description of the Board",
        picture: "URL or path to the board photo",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(201);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");
  });

  it("create board but don't have body return error message", async () => {
    const res = await request(app)
      .post("/board/create")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Body data is not provided");
  });

  it("create board but don't have board data in body return error message", async () => {
    const res = await request(app)
      .post("/board/create")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Body data is not provided");
  });

  it("create board but don't have title in body return error message", async () => {
    const res = await request(app)
      .post("/board/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        detail: "Detailed Description of the Board",
        picture: "URL or path to the board photo",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Missing necessary board data: title");
  });

  it("create board but don't have title in body return error message", async () => {
    const res = await request(app)
      .post("/board/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Board Title",
        picture: "URL or path to the board photo",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Missing necessary board data: detail");
  });

  it("create board but don't have title in body return error message", async () => {
    const res = await request(app)
      .post("/board/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Board Title",
        detail: "Detailed Description of the Board",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Missing necessary board data: picture");
  });

  it("don't have token in authorization return error message", async () => {
    const res = await request(app)
      .post("/board/create")
      .send({
        title: "Board Title",
        detail: "Detailed Description of the Board",
        picture: "URL or path to the board photo",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No token provided");
  });

  it("have invalid token in authorization return error message", async () => {
    const res = await request(app)
      .post("/board/create")
      .set("Authorization", `Bearer invalid-token`)
      .send({
        title: "Board Title",
        detail: "Detailed Description of the Board",
        picture: "URL or path to the board photo",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt malformed");
  });

  it("have invalid token format in authorization return error message", async () => {
    const res = await request(app)
      .post("/board/create")
      .set("Authorization", `${token}`)
      .send({
        title: "Board Title",
        detail: "Detailed Description of the Board",
        picture: "URL or path to the board photo",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Invalid token format");
  });

  it("have expired token in authorization return error message", async () => {
    clock = sinon.useFakeTimers(new Date().getTime());
    clock.tick(24 * 60 * 60 * 1000);

    const res = await request(app)
      .post("/board/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Board Title",
        detail: "Detailed Description of the Board",
        picture: "URL or path to the board photo",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt expired");
  });

  it("have token from the future in authorization return user data", async () => {
    clock = sinon.useFakeTimers(new Date(2000, 1, 1).getTime());

    const res = await request(app)
      .post("/board/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Board Title",
        detail: "Detailed Description of the Board",
        picture: "URL or path to the board photo",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("This token was issued in the future!");
  });
});
