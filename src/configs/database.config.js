import pg from "pg";
import dotenv from "dotenv";

import { logger } from "../utils/logger.util.js";
import createBoardTable from "../models/board/board.model.js";
import createBoardCommentTable from "../models/board/comment.model.js";
import createBoardDepthCommentTable from "../models/board/depthcomment.model.js";
import createRestaurantDibsTable from "../models/restaurant/dibs.model.js";
import createRestaurantLikeTable from "../models/restaurant/like.model.js";
import createRestaurantMenuTable from "../models/restaurant/menu.model.js";
import createRestaurantTable from "../models/restaurant/restaurant.model.js";
import createRestaurantReviewTable from "../models/restaurant/review.model.js";
import createRestaurantReviewCommentTable from "../models/restaurant/reviewcomment.model.js";
import createRestaurantStarTable from "../models/restaurant/star.model.js";
import createBusinessInfoTable from "../models/user/businessinfo.model.js";
import createUsersTable from "../models/user/user.model.js";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
  connectionString:
    process.env.NODE_ENV !== "test"
      ? process.env.DATABASE_URL
      : process.env.TEST_DATABASE_URL,
});

async function migrations() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await createUsersTable(client);
    await createBusinessInfoTable(client);
    await createRestaurantTable(client);
    await createBoardTable(client);
    await createBoardCommentTable(client);
    await createBoardDepthCommentTable(client);
    await createRestaurantLikeTable(client);
    await createRestaurantDibsTable(client);
    await createRestaurantStarTable(client);
    await createRestaurantMenuTable(client);
    await createRestaurantReviewTable(client);
    await createRestaurantReviewCommentTable(client);

    logger.info("All tables created successfully!");

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");

    logger.warn("Error in migrations: " + err.message);

    return err.message;
  } finally {
    client.release();
  }
}

async function connectDb() {
  try {
    const res = await pool.query("SELECT NOW()");

    logger.info(
      `Database connection successful! Current server time is: ` +
        res.rows[0].now
    );

    await migrations();
  } catch (err) {
    logger.warn("Error occurred during database connection:", err);
  }
}

export { pool, connectDb };
