import request from "supertest";

import app from "../../index.js";

describe("GET /restaurant/:restaurantId", () => {
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

  it("get restaurant return success message and restaurant data", async () => {
    const res = await request(app)
      .get("/restaurant/1")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");

    expect(res.body).toHaveProperty("restaurant");
    expect(typeof res.body.restaurant).toBe("object");
    expect(res.body.restaurant.length).not.toBe(0);
  });

  it("invaild restaurant id in url return error message", async () => {
    const res = await request(app)
      .get("/restaurant/2")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No data found with the provided criteria");
  });
});
