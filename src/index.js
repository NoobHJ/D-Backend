import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import session from "express-session";
import morgan from "morgan";

import { logger } from "./utils/logger.util.js";
import { stream } from "./utils/logger.util.js";
import { connectDb } from "./configs/database.config.js";
import authRouter from "./routes/auth/auth.route.js";
import userRouter from "./routes/user/user.route.js";
import boardRouter from "./routes/board/board.route.js";
import boardCommentRouter from "./routes/board/comment.route.js";
import boardDepthCommentRouter from "./routes/board/depthcomment.route.js";
import restaurantRouter from "./routes/restaurant/restaurant.route.js";
import restaurantLikeRouter from "./routes/restaurant/like.route.js";
import restaurantMenuRouter from "./routes/restaurant/menu.route.js";
import restaurantDibsRouter from "./routes/restaurant/dibs.route.js";
import restaurantReviewRouter from "./routes/restaurant/review.route.js";

dotenv.config();

const app = express();

connectDb();

app.use(
  morgan("':method :url :status :res[content-length] - :response-time ms'", {
    stream,
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/board", boardRouter, boardCommentRouter, boardDepthCommentRouter);
app.use(
  "/restaurant",
  restaurantRouter,
  restaurantLikeRouter,
  restaurantMenuRouter,
  restaurantDibsRouter,
  restaurantReviewRouter
);

app.get("*", async (req, res) => {
  return res.status(404).json("404 page No data found");
});

app.get("/", async (req, res) => {
  return res.send("Login success");
});

if (process.env.NODE_ENV !== "test") {
  app.listen(process.env.SERVER_PORT, () => {
    logger.info("Server started");
  });
}

export default app;
