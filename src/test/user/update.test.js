import request from "supertest";
import sinon from "sinon";

import app from "../../index.js";

describe("PATCH /user/:userId/update", () => {
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

  it("update user return success message", async () => {
    const res = await request(app)
      .patch("/user/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nickname: "example-nickname",
        profile_image: "example-image",
        gender: "male",
        age: 20,
        latitude: 0.1,
        longitude: 0.2,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");
  });

  it("update user but can't update invaild field data in body return error message", async () => {
    const res = await request(app)
      .patch("/user/1/update")
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

  it("update user but can't update field data in body return error message", async () => {
    const res = await request(app)
      .patch("/user/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        role: "admin",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Invalid column in the provided data");
  });

  it("update user but invaild user id in url return error message", async () => {
    const res = await request(app)
      .patch("/user/2/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nickname: "example-nickname",
        profile_image: "example-image",
        gender: "male",
        age: 20,
        latitude: 0.1,
        longitude: 0.2,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("User id does not match with id");
  });

  it("update user but don't have token in authorization return error message", async () => {
    const res = await request(app)
      .patch("/user/1/update")
      .send({
        nickname: "example-nickname",
        profile_image: "example-image",
        gender: "male",
        age: 20,
        latitude: 0.1,
        longitude: 0.2,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No token provided");
  });

  it("update user but have invaild token in authorization return error message", async () => {
    const res = await request(app)
      .patch("/user/1/update")
      .set("Authorization", `Bearer invaild-token`)
      .send({
        nickname: "example-nickname",
        profile_image: "example-image",
        gender: "male",
        age: 20,
        latitude: 0.1,
        longitude: 0.2,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt malformed");
  });

  it("update user but have invaild token format in authorization return error message", async () => {
    const res = await request(app)
      .patch("/user/1/update")
      .set("Authorization", `${token}`)
      .send({
        nickname: "example-nickname",
        profile_image: "example-image",
        gender: "male",
        age: 20,
        latitude: 0.1,
        longitude: 0.2,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Invalid token format");
  });

  it("update user but have expired token in authorization return error message", async () => {
    clock = sinon.useFakeTimers(new Date().getTime());
    clock.tick(24 * 60 * 60 * 1000);

    const res = await request(app)
      .patch("/user/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nickname: "example-nickname",
        profile_image: "example-image",
        gender: "male",
        age: 20,
        latitude: 0.1,
        longitude: 0.2,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt expired");
  });

  it("update user but have token form the future in authorization return user data", async () => {
    clock = sinon.useFakeTimers(new Date(2000, 1, 1).getTime());

    const res = await request(app)
      .patch("/user/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nickname: "example-nickname",
        profile_image: "example-image",
        gender: "male",
        age: 20,
        latitude: 0.1,
        longitude: 0.2,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("This token was issued in the future!");
  });
});
