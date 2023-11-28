import request from "supertest";
import sinon from "sinon";

import app from "../../index.js";

describe("PATCH /restaurant/:restaurantId", () => {
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

  it("update restaurant return success message", async () => {
    const res = await request(app)
      .patch("/restaurant/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name update",
        detail: "Detailed Description of the Restaurant update",
        photo: "URL or path to the photo update",
        address: "Restaurant Address update",
        latitude: 12.3456123,
        longitude: 78.9101123,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");
  });

  it("update restaurant but can't update invaild field data in body return error message", async () => {
    const res = await request(app)
      .patch("/restaurant/1/update")
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

  it("update restaurant but can't update field data in body return error message", async () => {
    const res = await request(app)
      .patch("/restaurant/1/update")
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

  it("update restaurant but invaild user id in url return error message", async () => {
    const res = await request(app)
      .patch("/restaurant/2/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name update invaild",
        detail: "Detailed Description of the Restaurant update invaild",
        photo: "URL or path to the photo update invaild",
        address: "Restaurant Address update invaild",
        latitude: 40.0,
        longitude: 40.0,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No data was found to update in table");
  });

  it("update restaurant but don't have token in authorization return error message", async () => {
    const res = await request(app)
      .patch("/restaurant/1/update")
      .send({
        name: "Restaurant Name update",
        detail: "Detailed Description of the Restaurant update",
        photo: "URL or path to the photo update",
        address: "Restaurant Address update",
        latitude: 12.3456123,
        longitude: 78.9101123,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No token provided");
  });

  it("update restaurant but have invaild token in authorization return error message", async () => {
    const res = await request(app)
      .patch("/restaurant/1/update")
      .set("Authorization", `Bearer invaild-token`)
      .send({
        name: "Restaurant Name update",
        detail: "Detailed Description of the Restaurant update",
        photo: "URL or path to the photo update",
        address: "Restaurant Address update",
        latitude: 12.3456123,
        longitude: 78.9101123,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt malformed");
  });

  it("update restaurant but have invaild token format in authorization return error message", async () => {
    const res = await request(app)
      .patch("/restaurant/1/update")
      .set("Authorization", `${token}`)
      .send({
        name: "Restaurant Name update",
        detail: "Detailed Description of the Restaurant update",
        photo: "URL or path to the photo update",
        address: "Restaurant Address update",
        latitude: 12.3456123,
        longitude: 78.9101123,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Invalid token format");
  });

  it("update restaurant but have expired token in authorization return error message", async () => {
    clock = sinon.useFakeTimers(new Date().getTime());
    clock.tick(24 * 60 * 60 * 1000);

    const res = await request(app)
      .patch("/restaurant/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name update",
        detail: "Detailed Description of the Restaurant update",
        photo: "URL or path to the photo update",
        address: "Restaurant Address update",
        latitude: 12.3456123,
        longitude: 78.9101123,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt expired");
  });

  it("update restaurant but have token form the future in authorization return user data", async () => {
    clock = sinon.useFakeTimers(new Date(2000, 1, 1).getTime());

    const res = await request(app)
      .patch("/restaurant/1/update")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name update",
        detail: "Detailed Description of the Restaurant update",
        photo: "URL or path to the photo update",
        address: "Restaurant Address update",
        latitude: 12.3456123,
        longitude: 78.9101123,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("This token was issued in the future!");
  });
});
