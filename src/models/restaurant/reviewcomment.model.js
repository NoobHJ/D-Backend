import { logger } from "../../utils/logger.util.js";

async function createRestaurantReviewCommentTable(client) {
  try {
    await client.query(
      `CREATE TABLE IF NOT EXISTS restaurant_review_comments (
        id SERIAL PRIMARY KEY,
        comment VARCHAR,
        deleted BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT current_timestamp,
        deleted_at TIMESTAMP DEFAULT null,
        restaurant_reviews_id INTEGER REFERENCES restaurant_reviews(id)
      );`
    );

    logger.info("'restaurant_review_comments' table created successfully!");
  } catch (err) {
    logger.warn(
      "Error creating 'restaurant_review_comments' table: " + err.message
    );

    throw err;
  }
}

export default createRestaurantReviewCommentTable;
