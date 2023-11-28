import request from "supertest";

import app from "../../index.js";

describe("POST /auth/login/google", () => {
  it("create user and return token", async () => {
    const res = await request(app)
      .post("/auth/login/google")
      .send({
        user: {
          id: 1,
          email: "example1@gmail.com",
          name: "example1",
        },
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");

    expect(res.body).toHaveProperty("token");
    expect(typeof res.body.token).toBe("string");
    expect(res.body.token.length).not.toBe(0);
  });

  it("create user but don't have user data in body return error message", async () => {
    const res = await request(app)
      .post("/auth/login/google")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("User data is not provided");
  });

  it("create user but don't have id(provider_id) in user return error message", async () => {
    const res = await request(app)
      .post("/auth/login/google")
      .send({
        user: {
          email: "example@gmail.com",
          name: "example",
        },
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Missing necessary user data: id");
  });

  it("create user but don't have email in user return error message", async () => {
    const res = await request(app)
      .post("/auth/login/google")
      .send({
        user: {
          id: 1000,
          name: "example",
        },
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Missing necessary user data: email");
  });

  it("create user but don't have name in user return error message", async () => {
    const res = await request(app)
      .post("/auth/login/google")
      .send({
        user: {
          id: 1000,
          email: "example@gmail.com",
        },
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Missing necessary user data: name");
  });

  it("create user but don't have id and name in user return error message", async () => {
    const res = await request(app)
      .post("/auth/login/google")
      .send({
        user: {
          email: "example@gmail.com",
        },
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Missing necessary user data: id, name");
  });

  it("create user but don't have id and email in user return error message", async () => {
    const res = await request(app)
      .post("/auth/login/google")
      .send({
        user: {
          name: "example",
        },
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Missing necessary user data: id, email");
  });

  it("create user but don't have email and name in user return error message", async () => {
    const res = await request(app)
      .post("/auth/login/google")
      .send({
        user: {
          id: 1000,
        },
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Missing necessary user data: email, name");
  });

  it("create user but don't have id, email and name in user return error message", async () => {
    const res = await request(app)
      .post("/auth/login/google")
      .send({
        user: {},
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("User data is not provided");
  });

  it("create user but invaild email return error message", async () => {
    const res = await request(app)
      .post("/auth/login/google")
      .send({
        user: {
          id: 2,
          email: "example2-email",
          name: "example2",
        },
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Provided email address is invalid");
  });
});
