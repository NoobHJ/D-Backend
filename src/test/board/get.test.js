import request from "supertest";
import app from "../../index.js";

describe("GET /board/:boardId", () => {
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

  it("get board return success message and board data", async () => {
    const res = await request(app)
      .get("/board/1")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(200);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("Success");

    expect(res.body).toHaveProperty("board");
    expect(typeof res.body.board).toBe("object");
    expect(res.body.board.length).not.toBe(0);
  });

  it("invalid board id in url return error message", async () => {
    const res = await request(app)
      .get("/board/2")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(400);

    expect(res.body).toHaveProperty("message");
    expect(typeof res.body.message).toBe("string");
    expect(res.body.message).toBe("No data found with the provided criteria");
  });

  it("invalid board id in url return error message", async () => {
    const res = await request(app)
      .get("/board/2/*")
      .expect("Content-Type", "application/json; charset=utf-8")
      .expect(404);

    expect(res.text).toBe('"404 page No data found"');
  });
});
