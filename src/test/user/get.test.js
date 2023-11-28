import request from "supertest";
import sinon from "sinon";

import app from "../../index.js";

describe("GET /user/:userId", () => {
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

  it("get user return success message and user data", async () => {
    const res = await request(app)
      .get("/user/1")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");

    expect(res.body).toHaveProperty("user");
    expect(typeof res.body.user).toBe("object");
    expect(res.body.user.length).not.toBe(0);
  });

  it("invaild user id in url return error message", async () => {
    const res = await request(app)
      .get("/user/2")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("User id does not match with id");
  });

  it("don't have token in authorization return error message", async () => {
    const res = await request(app)
      .get("/user/1")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No token provided");
  });

  it("have invaild token in authorization return error message", async () => {
    const res = await request(app)
      .get("/user/1")
      .set("Authorization", `Bearer invaild-token`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt malformed");
  });

  it("have invaild token format in authorization return error message", async () => {
    const res = await request(app)
      .get("/user/1")
      .set("Authorization", `${token}`)
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
      .get("/user/1")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt expired");
  });

  it("have token form the future in authorization return user data", async () => {
    clock = sinon.useFakeTimers(new Date(2000, 1, 1).getTime());

    const res = await request(app)
      .get("/user/1")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("This token was issued in the future!");
  });
});
