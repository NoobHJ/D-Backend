import request from "supertest";
import sinon from "sinon";

import app from "../../index.js";

describe("POST /restaurant/create", () => {
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

  it("create restaurant return success message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name",
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
        latitude: 12.3456,
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(201);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");
  });

  it("create restaurant but don't have body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Body data is not provided");
  });

  it("create restaurant but don't have restaurant data in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send()
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Body data is not provided");
  });

  it("create restaurant but don't have name in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
        latitude: 12.3456,
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Missing necessary restaurant data: name");
  });

  it("create restaurant but don't have address in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name",
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        latitude: 12.3456,
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Missing necessary restaurant data: address");
  });

  it("create restaurant but don't have latitude in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name",
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe(
      "Missing necessary restaurant data: latitude"
    );
  });

  it("create restaurant but don't have longitude in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name",
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
        latitude: 12.3456,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe(
      "Missing necessary restaurant data: longitude"
    );
  });

  it("create restaurant but don't have name, address in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        latitude: 12.3456,
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe(
      "Missing necessary restaurant data: name, address"
    );
  });

  it("create restaurant but don't have name, latitude in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe(
      "Missing necessary restaurant data: name, latitude"
    );
  });

  it("create restaurant but don't have name, longitude in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
        latitude: 12.3456,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe(
      "Missing necessary restaurant data: name, longitude"
    );
  });

  it("create restaurant but don't have name, address, latitude in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe(
      "Missing necessary restaurant data: name, address, latitude"
    );
  });

  it("create restaurant but don't have name, address, longitude in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        latitude: 12.3456,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe(
      "Missing necessary restaurant data: name, address, longitude"
    );
  });

  it("create restaurant but don't have name, latitude, longitude in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe(
      "Missing necessary restaurant data: name, latitude, longitude"
    );
  });

  it("create restaurant but don't have address, latitude, longitude in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name",
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe(
      "Missing necessary restaurant data: address, latitude, longitude"
    );
  });

  it("create restaurant but don't have name, address, latitude, longitude in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe(
      "Missing necessary restaurant data: name, address, latitude, longitude"
    );
  });

  it("create restaurant but don't have detail in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
        latitude: 12.3456,
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(201);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");
  });

  it("create restaurant but don't have photo in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name",
        detail: "Detailed Description of the Restaurant",
        address: "Restaurant Address",
        latitude: 12.3456,
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(201);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");
  });

  it("create restaurant but don't have detail, photo in body return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name",
        address: "Restaurant Address",
        latitude: 12.3456,
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(201);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");
  });

  it("don't have token in authorization return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .send({
        name: "Restaurant Name",
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
        latitude: 12.3456,
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No token provided");
  });

  it("have invaild token in authorization return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer invaild-token`)
      .send({
        name: "Restaurant Name",
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
        latitude: 12.3456,
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt malformed");
  });

  it("have invaild token format in authorization return error message", async () => {
    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `${token}`)
      .send({
        name: "Restaurant Name",
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
        latitude: 12.3456,
        longitude: 78.9101,
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
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name",
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
        latitude: 12.3456,
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("jwt expired");
  });

  it("have token form the future in authorization return user data", async () => {
    clock = sinon.useFakeTimers(new Date(2000, 1, 1).getTime());

    const res = await request(app)
      .post("/restaurant/create")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Restaurant Name",
        detail: "Detailed Description of the Restaurant",
        photo: "URL or path to the photo",
        address: "Restaurant Address",
        latitude: 12.3456,
        longitude: 78.9101,
      })
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(401);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("This token was issued in the future!");
  });
});
