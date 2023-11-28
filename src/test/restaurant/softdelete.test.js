import request from "supertest";
import sinon from "sinon";

import app from "../../index.js";

describe("PATCH /restaurant/:restaurantId/update", () => {
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

    const resRestaurant = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name",
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
        latitude: 12.3456,
        longitude: 78.9101,
      });
  });

  it("soft-delete restaurant return success message", async () => {
    const res = await request(app)
      .patch("/restaurant/1/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");
  });

  it("soft-delete restaurant but invaild restaurant id in url return error message", async () => {
    const res = await request(app)
      .patch("/restaurant/2/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No data was found to delete in table");
  });

  it("soft-delete restaurant but don't have token in authorization return error message", async () => {
    const res = await request(app)
      .patch("/restaurant/1/soft-delete")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No token provided");
  });

  it("soft-delete restaurant but have invaild token in authorization return error message", async () => {
    const res = await request(app)
      .patch("/restaurant/1/soft-delete")
      .set("Authorization", `Bearer invaild-token`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt malformed");
  });

  it("soft-delete restaurant but have invaild token format in authorization return error message", async () => {
    const res = await request(app)
      .patch("/restaurant/1/soft-delete")
      .set("Authorization", `${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Invalid token format");
  });

  it("soft-delete restaurant but have expired token in authorization return error message", async () => {
    clock = sinon.useFakeTimers(new Date().getTime());
    clock.tick(24 * 60 * 60 * 1000);

    const res = await request(app)
      .patch("/restaurant/1/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt expired");
  });

  it("soft-delete restaurant but have token form the future in authorization return user data", async () => {
    clock = sinon.useFakeTimers(new Date(2000, 1, 1).getTime());

    const res = await request(app)
      .patch("/restaurant/1/soft-delete")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("This token was issued in the future!");
  });
});
